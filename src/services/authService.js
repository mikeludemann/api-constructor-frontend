import http from '../http'
import {ADMIN_LOGIN_URL} from '../api';

const authBody = {
  grant_type: 'password',
  client_id: 'ABC...XYZ' // OAuth Client ID (Replace 'ABC...XYZ')
};

const authBodyRefreshToken = {
  grant_type: 'refresh_token',
  client_id: 'ABC...XYZ' // OAuth Client ID (Replace 'ABC...XYZ')
};

const authService = {
  login(credentials) {
    const body = Object
      .entries({ ...credentials, ...authBody })
      .map((arr) => arr.join('='))
      .join('&');
    return new Promise((resolve, reject) => {
      http.post(ADMIN_LOGIN_URL, body)
        .then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  },
  loginUser (credentials, userId) {
    const body = Object
      .entries({ ...credentials, ...authBody })
      .map((arr) => arr.join('='))
      .join('&');
    return new Promise((resolve, reject) => {
      http.post(`/oauth2/${userId}/token`, body)
        .then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  },
  refreshToken(userId) {
    const body = Object
      .entries({ ...authBodyRefreshToken, refresh_token: localStorage.getItem(process.env.REACT_APP_REFRESHTOKEN_NAME)})
      .map((arr) => arr.join('='))
      .join('&');
    return new Promise((resolve, reject) => {
      http.post(`/oauth2/${userId}/token`, body)
        .then((res) => {
          resolve(res);
          localStorage.setItem( process.env.REACT_APP_REFRESHTOKEN_NAME, res.data.refresh_token)
          localStorage.setItem( process.env.REACT_APP_TOKEN_NAME, res.data.access_token)
        }, (err) => {
          reject(err);
        });
    });
  },
}

export default authService
