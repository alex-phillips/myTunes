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

export default class RouterComponent extends Component {
  render() {
    return(
      <Router hideNavBar>
        <Scene key='artistList' component={ArtistList} initial title="Artists" />
        <Scene key="artistShow" component={ArtistDetails} title="Artist Detail"/>
      </Router>
    );
  }
}
