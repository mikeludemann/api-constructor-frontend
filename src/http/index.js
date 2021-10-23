import axios from 'axios';
import helpers from '../helpers'

class Http {
  constructor() {
    const service = axios.create({baseURL: process.env.REACT_APP_API_URL});

    const requestHandler = request => {
      if (helpers.getToken()) {
        request.headers.common['Authorization'] = helpers.getFullToken()
      }
      return request
    }
    // Attach headers on request
    service.interceptors.request.use(requestHandler)

    const responseSuccessHandler = response => {
      return response;
    };

    const responseErrorHandler = error => {
      if (error.response && error.response.status === 401) {
        helpers.deleteToken()
        window.location.href = '/login'
      }
      return Promise.reject(error);
    }
    // Attach the response and the error
    service.interceptors.response.use(
      response => responseSuccessHandler(response),
      error => responseErrorHandler(error)
    );

    this.service = service;
  }
  get(path, payload) {
    if(payload){
      return this.service.get(path, payload)
    }
    return this.service.get(path)
  }
  post(path, payload, headers) {
    if (headers) {
      this.service.defaults.headers['Content-Type'] = 'multipart/form-data'
      this.service.defaults.headers['Enctype'] = 'multipart/form-data'
      this.service.defaults.headers['Accept'] = 'multipart/form-data'
    }
    return this.service.post(path, payload)
  }
  put(path, payload) {
    return this.service.put(path, payload)
  }
  patch(path, payload) {
    return this.service.patch(path, payload)
  }
  delete(path) {
    return this.service.delete(path)
  }
  options(path, payload) {
    return this.service.options(path, payload)
  }
  request(payload) {
    return this.service.request(payload)
  }
  head(path, payload) {
    return this.service.head(path, payload)
  }
}

export default new Http();
