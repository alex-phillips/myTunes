'use strict';

import API from './API';
import Storage from 'react-native-storage';
import {
  AsyncStorage,
} from 'react-native';

let instance = null;

export default class Koel extends API {
  constructor(server, protocol = 'https') {
    super();

    if (server && server.match(/https?/)) {
      this.protocol = server.match(/https?/)[0];
      this.server = server.match(/:\/\/(.+?)$/)[1];
    } else {
      this.protocol = protocol;
      this.server = server;
    }

    this.data = null;
    this.artists = [];
    this.albums = [];

    this.storage = new Storage({
      defaultExpire: null,
      storageBackend: AsyncStorage,
    });
  }

  getArtists() {
    let self = this;

    return new Promise((resolve, reject) => {
      this.getLibrary()
        .then(() => {
          return resolve(self.artists);
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getArtistsAlbums(artistId) {
    let self = this,
      retval = {};
    return new Promise((resolve, reject) => {
      for (let albumId of self.artists[artistId].albums) {
        retval[albumId] = self.albums[albumId];
      }

      return resolve(retval);
    });
  }

  getAlbum(id) {
    let self = this;
    return new Promise((resolve, reject) => {
      if (self.albums[id]) {
        return resolve(self.albums[id]);
      }

      return reject(Error(`No album exists with id ${id}`));
    });
  }

  getLibrary() {
    let self = this;

    return new Promise((resolve, reject) => {
      if (self.data) {
        return resolve();
      }

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
          self.data = data;
          for (let artist of data.artists) {
            self.artists[artist.id] = JSON.parse(JSON.stringify(artist));
            self.artists[artist.id].albums = [];
            for (let album of artist.albums) {
              self.albums[album.id] = album;
              self.artists[artist.id].albums.push(album.id);
              if (album.is_compilation) {
                for (let song of album.songs) {
                  if (song.contributing_artist_id && self.artists[song.contributing_artist_id]) {
                    if (self.artists[song.contributing_artist_id].albums.indexOf(album.id) === -1) {
                      self.artists[song.contributing_artist_id].albums.push(album.id);
                    }
                  }
                }
              }
            }
          }

          for (let i = 0; i < self.artists.length; i++) {
            if (self.artists[i] === undefined) {
              self.artists.slice(i, 1);
            }
          }

          return resolve();
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  getPlayUrl(songId, time) {
    let self = this;
    return new Promise((resolve, reject) => {
      let url = `${self.protocol}://${self.server}/api/${songId}/play/`;

      if (self.streamLossless) {
        url += '0/';
      } else {
        url += '1/256/';
      }

      let query = [
        'jwt-token=' + self.token
      ];

      if (time && time > 0) {
        query.push('time=' + time);
      }

      console.log(`[Koel][getPlayUrl] - ${url + '?' + query.join('&')}`);

      return resolve(url + '?' + query.join('&'));
    });
  }

  login(email, password) {
    let self = this;
    return new Promise((resolve, reject) => {
      fetch(`${self.protocol}://${self.server}/api/me`, {
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
          return response.json();
        })
        .then(json => {
          self.token = json.token;
          self.storage.save({
            key: 'auth',
            rawData: {
              token: json.token,
              protocol: self.protocol,
              server: self.server,
            },
          });

          return resolve();
        })
        .catch(err => {
          return reject(err);
        });
    });
  }

  ping() {
    let self = this;
    return new Promise((resolve, reject) => {
      self.storage.load({
        key: 'auth',
      })
        .then(auth => {
          self.server = auth.server;
          self.protocol = auth.protocol;
          self.token = auth.token;
        })
        .catch(() => {})
        .done(() => {
          if (!self.token) {
            return reject();
          }

          return fetch(`${self.protocol}://${self.server}/api/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`
            },
          })
            .then(() => {
              return resolve();
            })
            .catch(() => {
              return reject();
            });
        });
    });
  }

  static resetInstance() {
    instance = null;

    return Koel;
  }

  static getInstance(...args) {
    if (!instance) {
      instance = new Koel(...args);
    }

    return instance;
  }
}
