'use strict';

import API from './API';

let instance = null;

export default class Koel extends API {
  constructor(server, protocol = 'http') {
    super();
    this.protocol = protocol;
    this.server = server;
  }

  getLibrary(callback) {
    fetch(`${this.protocol}://${this.server}/api/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        callback(null, data);
      })
      .catch(err => {
        return callback(err);
      });
  }

  login(email, password, callback) {
    let self = this;
    fetch(`${this.protocol}://${this.server}/api/me`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'email': email,
        'password': password,
      })
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        self.token = json.token;
        callback()
      })
      .catch(err =>
        console.log(err)
      );
  }

  ping(callback) {

  }

  static getInstance(...args) {
    if (!instance) {
      instance = new Koel(...args);
    }

    return instance;
  }
}
