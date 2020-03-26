import { Platform } from 'react-native';

import CONST from '../core/const';
import { auth, logout } from './user';
import log from './log';

export function upload(img, type) {
  const data = new FormData();
  data.append('picture', {
    uri: (Platform.OS === 'android' ? 'file://' : '') + img,
    name: type + '-' + Math.round(Date.now() * Math.random() * 100) + '.jpg',
    type: 'image/jpeg'
  });

  return auth().then(access => {
    return fetch(CONST.API_BASE + '/picture/' + type + '/', {
      method: 'POST',
      headers: {
        'Authorization': access,
      },
      body: data
    });
  })
    .then(res => {
      if (res.status != 200) {
        if (res.status === 401) {
          return logout();
        }

        const e = Error('HTTP call failed');
        e.status = res.status;
        e.body = res.text();
        return Promise.reject(e);
      }

      return res.text();
    });
}
