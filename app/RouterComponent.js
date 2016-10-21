'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
} from 'react-native';
import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux';
import ArtistList from './components/artists/ArtistList';
import ArtistShow from './components/artists/ArtistShow';
import Player from './components/player/Player';
import AppNavigator from './components/navigation/AppNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';

class RouterComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: "artists"
    }
  }

  render() {
    return (
      <TabBarIOS
        selectedTab={this.state.selectedTab}
        barTintColor='black'
        tintColor='orange'
        >

        <Icon.TabBarItemIOS
          selected={this.state.selectedTab === "artists"}
          title={`Artists`}
          iconName="user"
          onPress={() => this.setState({selectedTab: "artists"})}>
          <AppNavigator
            initialRoute={{ident: "ArtistList"}} />
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          selected={this.state.selectedTab === "settings"}
          title={`Settings`}
          iconName="gear"
          onPress={() => this.setState({selectedTab: "settings"})}>
          <AppNavigator
            initialRoute={{ident: "Settings"}} />
        </Icon.TabBarItemIOS>

      </TabBarIOS>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  }
});

module.exports = RouterComponent;
