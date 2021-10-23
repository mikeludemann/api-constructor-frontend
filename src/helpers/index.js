import jwtDecode from 'jwt-decode';

const helpers = {
  getToken() {
    return localStorage.getItem(process.env.REACT_APP_TOKEN_NAME)
  },
  getFullToken() {
    return process.env.REACT_APP_TOKEN_PREFIX + ' ' + this.getToken()
  },
  getDecodedToken() {
    return jwtDecode(localStorage.getItem(process.env.REACT_APP_TOKEN_NAME));
  },
  setToken(token) {
    localStorage.setItem(process.env.REACT_APP_TOKEN_NAME, token)
  },
  deleteToken() {
    localStorage.removeItem(process.env.REACT_APP_TOKEN_NAME)
    localStorage.removeItem('auth')
  },
  getTokenExpirationDate() {
    let encodedToken = this.getToken()
    if (!encodedToken) {
      return null
    }
    const token = jwtDecode(encodedToken)
    if (!token.exp) {
      return null
    }
    const date = new Date(0)
    date.setUTCSeconds(token.exp)

    return date
  },
  setTokenUser(user) {
    localStorage.setItem('auth', JSON.stringify(user))
  },
  getTokenUser() {
    let user = JSON.parse(localStorage.getItem('auth'))
    return user || {}
  },
  formHandleError: function (error) {
    let output = [];
    if (error.response.data.message) {
      output.push('<strong>' + error.response.data.message + '</strong><br />');
    }
    if (error.response.data.errors) {
      let errors = error.response.data.errors;
      let obj;
      for (let key in errors) {
        // skip loop if the property is from prototype
        if (!errors.hasOwnProperty(key)) continue;
        obj = errors[key];
      }
      output.push('<strong>' + obj[0] + '</strong><br />');
    }

    if (error.response.data.payload) {
      let fieldErrors = error.response.data.payload;
      for (let field in fieldErrors) {
        //output.push( '<strong>' + field + '</strong><br />' ); - Removed after discussing with the team.
        if(fieldErrors.hasOwnProperty(field)) {
          fieldErrors[field].forEach(item => {
            output.push('- ' + item + '<br />');
          });
        }
      }
    }
    return output.join( '' )
  },
  isTokenExpired() {
    const expirationDate = this.getTokenExpirationDate()
    if (!expirationDate) {
      return true
    }
    return expirationDate < new Date()
  }
}

export default helpers;
