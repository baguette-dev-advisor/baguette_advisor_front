import _ from 'lodash';

import CONST from '../core/const';
import { auth, logout } from './user';
import I18n from '../i18n/i18n';
import log from './log';

const markets = {};

export function get(id) {
  return markets[id];
}

export function find(lat, long, radius) {
  return new Promise((resolve, reject) => {
    fetch(CONST.API_BASE + '/markets/' + encodeURI(lat) + '/' + encodeURI(long) + '/' + encodeURI(radius) + '/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('UNAUTHORIZED');
        } else if (res.status < 200 || res.status > 300) {
          throw new Error(JSON.stringify({ status: res.status, body: res.text() }));
        }
        return res;
      })
      .then(res => res.json())
      .then(res => {
        let ms = res;
        if (!_.isArray(ms)) {
          ms = [];
        }
        ms.forEach(m => {
          // console.warn(JSON.stringify(m))
          markets[m.id] = {
            name: m.name,
            hunter: m.hunter,
            picture: m.picture,
            latitude: parseFloat(m.latitude),
            longitude: parseFloat(m.longitude),
            category: m.category,
            distance: m.distance,
            advices: m.advices,
            address: m.address,
            opendays: m.opendays,
            products: m.products,
            ratings: m.ratings,
            raters: m.raters,
            rating: m.rating,
          };
        });
        resolve(ms);
      })
      .catch(err => {
        if (err.message === 'UNAUTHORIZED') {
          return logout();
        }

        log.error('Market find', err);
        return reject(I18n.t('errors.default'));
      });
  });
}

export function create(name, products, pic, coordinate) {
  return auth().then(access => {
    return fetch(CONST.API_BASE + '/market/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': access
      },
      body: JSON.stringify({
        name,
        products,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        picture: pic
      })
    });
  }).then(res => {
    if (res.status != 200) {
      if (res.status === 401) {
        return logout();
      }

      return new Promise((resolve, reject) => {
        res.text().then(body => {
          const e = Error('HTTP call failed');
          e.status = res.status;
          e.body = body;
          reject(e);
        });
      });
    }

    return res.text();
  });
}

export function rate(id, product, rating, comment) {
  return auth().then(access => {
    return fetch(CONST.API_BASE + '/market/' + id + '/rating/' + product, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': access
      },
      body: JSON.stringify({
        rating,
        comment,
      })
    });
  }).then(res => {
    if (res.status != 200) {
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED');
      }

      // res.body().then(body => {
      //   console.warn('vobofw');
      //   log.error('Market rate ' + res.status + ': ', body);
      // });
      throw new Error(JSON.stringify({ status: res.status, body: res.text() }));
    }

    return res.json();
  }).then(res => {
    markets[id].raters = res.raters;
    markets[id].rating = res.rating;

    ids = {}
    Object.keys(markets[id].products).forEach((key) => {
      ids[markets[id].products[key].id] = key
    })
    markets[id].products[ids[product]].rating = res.rating
 
    return res;
  }).catch(err => {
    if (err.message === 'UNAUTHORIZED') {
      return logout();
    }

    console.warn(err.message);

    return Promise.reject(I18n.t('errors.default'));
  });
}
