import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import ArtistList from './ArtistList';
import ArtistDetails from './ArtistDetails';
import LoginScreen from './LoginScreen';

export default class RouterComponent extends Component {
  render() {
    return(
      <Router hideNavBar>
        <Scene key='loginScreen' component={LoginScreen} initial title="Login" />
        <Scene key='artistList' component={ArtistList} title="Artists" />
        <Scene key="artistShow" component={ArtistDetails} title="Artist Detail"/>
      </Router>
    );
  }
}
