import { AsyncStorage } from 'react-native';
import _ from 'lodash';

import CONST from '../core/const';
import {HttpError} from '../core/errors';
import I18n from '../i18n/i18n';
import log from './log';

const _user = {
  handle: ''
};

let _auth = {
  access: ''
};

const listeners = [];

const control = {
  save: () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem('user', JSON.stringify(_user))
        .then(() => {
          control.notify();
          resolve();
        })
        .catch((err) => {
          log.error('User save', err);
          return reject(I18n.t('errors.default'));
        });
    });
  },
  logout: () => {
    return AsyncStorage.multiRemove(['user', 'auth'])
      .then(() => {
        _user.handle = '';
        _user.email = '';
        _user.username = '';
        _auth.access = '';
        control.notify();
      })
      .catch((err) => {
        _user.handle = '';
        _user.email = '';
        _user.username = '';
        _auth.access = '';
        control.notify();
        log.error('User logout', err);
      });
  },
  load: () => {
    return new Promise((resolve) => {
      AsyncStorage.multiGet(['user', 'auth'])
        .then(v => {
          let u = {}, a = {};
          try { u = JSON.parse(v[0][1]); } catch (e) { log.error('User load', e);}
          try { a = JSON.parse(v[1][1]); } catch (e) { log.error('User load', e);}

          if (!a) {
            return resolve({});
          }

          if (!u) {
            return resolve({_user});
          }

          _.assign(_auth, a);
          _user.handle = u.handle;
          control.notify();
          resolve(_user);
        })
        .catch(err => {
          log.error('User load', err);
          resolve(_user);
        });
    });
  },
  onUpdate: cb => {
    listeners.push(cb);
  },
  notify: () => {
    listeners.forEach(listener => {
      listener(_user);
    });
  }
};

const user = _user;
export default user;
export const load = control.load;
export const logout = control.logout;
export const onUpdate = control.onUpdate;

export function auth() {
  return new Promise((resolve) => {
    if((Math.floor(Date.now()/1000) - _auth.at) > 3600) {
      resolve(_auth.access);
      return;
    }

    fetch(CONST.API_BASE + '/auth/refresh/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Authorization': _auth.access
      },
      body: JSON.stringify({
        refresh: _auth.refresh,
      })
    })
      .then(res => {
        if (res.status < 200 || res.status > 300) {
          return res.json().then(body => {
            throw new HttpError(res.status, body);
          });
        }
        return res.json();
      })
      .then(res => {
        _auth.access = res.token;
        _auth.at = Math.floor(Date.now()/1000);
        return AsyncStorage.setItem('auth', JSON.stringify(_auth));
      })
      .then(() => {
        resolve(_auth.access);
      }).catch(err => {
        if (err.name === 'HttpError') {
          log.error('Token refresh', err);

          resolve(_auth.access);
        }
      });
  });
}

export function get() {
  return _user;
}

export function signin(handle, password) {
  const _handle = handle.trim();
  const _password = password.trim();
  return new Promise((resolve, reject) => {
    if (!_handle) {
      return reject(I18n.t('errors.email.missing'));
    }
    if (!_password) {
      return reject(I18n.t('errors.password.missing'));
    }

    fetch(CONST.API_BASE + '/auth/signin/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: _handle,
        password: _password,
      })
    })
      .then(res => {
        if (res.status < 200 || res.status > 300) {
          return res.json().then(body => {
            throw new HttpError(res.status, body);
          });
        }
        return res;
      })
      .then(res => res.json())
      .then(res => {
        _auth.access = res.token;
        _auth.refresh = res.refresh;
        _auth.at = Math.floor(Date.now()/1000);
        return AsyncStorage.setItem('auth', JSON.stringify(_auth));
      })
      .then(() => {
        return fetch(CONST.API_BASE + '/user/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': _auth.access
          }
        });
      })
      .then(res => {
        if (res.status != 200) {
          return res.json().then(body => {
            throw new HttpError(res.status, body);
          });
        }

        return res.json();
      }).then(data => {
        console.warn(data);
        _user.email = data.mail;
        _user.username = data.username || '';
        _user.handle = _handle;
        return control.save();
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        if (err.name === 'HttpError') {
          if (err.code === 401) {
            return logout().then(() => { // should never happened
              return reject(I18n.t('errors.default'));
            });
          }
          if (err.code === 403) {
            if (err.body.error === 'user_not_found') {
              return reject(I18n.t('errors.email.unknown'));
            } else if (err.body.error === 'wrong_password') {
              return reject(I18n.t('errors.password.wrong'));
            }
          }
          if (err.code === 422) {
            if (err.body.error === 'missing_email') {
              return reject(I18n.t('errors.email.missing'));
            } else if (err.body.error === 'bad_email') {
              return reject(I18n.t('errors.email.bad'));
            } else if (err.body.error === 'too_short_email') {
              return reject(I18n.t('errors.email.short'));
            } else if (err.body.error === 'too_long_email') {
              return reject(I18n.t('errors.email.long'));
            } else if (err.body.error === 'missing_password') {
              return reject(I18n.t('errors.password.missing'));
            } else if (err.body.error === 'bad_password') {
              return reject(I18n.t('errors.password.bad'));
            } else if (err.body.error === 'too_short_password') {
              return reject(I18n.t('errors.password.short'));
            } else if (err.body.error === 'too_long_password') {
              return reject(I18n.t('errors.password.long'));
            }
          }
        }

        log.error('User signin', err);
        return reject(I18n.t('errors.default'));
      });
  });
}


export function signup(username, email, password) {
  const _username = username.trim();
  const _email = email.trim();
  const _password = password.trim();
  return new Promise((resolve, reject) => {
    if (!_username) {
      return reject(I18n.t('errors.username.missing'));
    }
    if (!_email) {
      return reject(I18n.t('errors.email.missing'));
    }
    if (!_password) {
      return reject(I18n.t('errors.password.missing'));
    }

    fetch(CONST.API_BASE + '/auth/signup/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: _username,
        mail: _email,
        password: _password,
      })
    })
      .then(res => {
        if (res.status < 200 || res.status > 300) {
          return res.json().then(body => {
            throw new HttpError(res.status, body);
          });
        }
        return res;
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        if (err.name === 'HttpError') {
          if (err.code === 422) {
            if (err.body.error === 'missing_email') {
              return reject(I18n.t('errors.email.missing'));
            } else if (err.body.error === 'bad_email') {
              return reject(I18n.t('errors.email.bad'));
            } else if (err.body.error === 'too_short_email') {
              return reject(I18n.t('errors.email.short'));
            } else if (err.body.error === 'too_long_email') {
              return reject(I18n.t('errors.email.long'));
            } else if (err.body.error === 'missing_password') {
              return reject(I18n.t('errors.password.missing'));
            } else if (err.body.error === 'bad_password') {
              return reject(I18n.t('errors.password.bad'));
            } else if (err.body.error === 'too_short_password') {
              return reject(I18n.t('errors.password.short'));
            } else if (err.body.error === 'too_long_password') {
              return reject(I18n.t('errors.password.long'));
            } else if (err.body.error === 'duplicated_email') {
              return reject(I18n.t('errors.email.duplicate'));
            }
          }
        }

        log.error('User signup', err);
        return reject(I18n.t('errors.default'));
      });
  });
}


export function setUsername(username) {
  const _username = username.trim();
  return new Promise((resolve, reject) => {
    if (!_username) {
      return reject(I18n.t('errors.username.missing'));
    }

    auth().then(access => {
      return fetch(CONST.API_BASE + '/user/', {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': access
        },
        body: JSON.stringify({
          username: _username,
        })
      });
    })
      .then(res => {
        if (res.status < 200 || res.status > 300) {
          return res.json().then(body => {
            throw new HttpError(res.status, body);
          });
        }
        return res;
      })
      .then(() => {
        _user.username =_username;
        return control.save();
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        if (err.name === 'HttpError') {
          if (err.code === 422) {
            if (err.body.error === 'missing_username') {
              return reject(I18n.t('errors.username.missing'));
            } else if (err.body.error === 'bad_username') {
              return reject(I18n.t('errors.username.bad'));
            } else if (err.body.error === 'too_short_username') {
              return reject(I18n.t('errors.username.short'));
            } else if (err.body.error === 'too_long_username') {
              return reject(I18n.t('errors.username.long'));
            } else if (err.body.error === 'duplicated_username') {
              return reject(I18n.t('errors.username.duplicate'));
            }
          }
        }

        log.error('User set username', err);
        return reject(I18n.t('errors.default'));
      });
  });
}
