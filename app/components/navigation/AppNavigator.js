'use strict';

import React, { Component } from 'react';
import { Navigator, Text } from 'react-native';
import { Artists } from '../../mockData';
import ArtistList from '../artists/ArtistList';

class AppNavigator extends Component {

  _renderScene(route, navigator) {
    var globalNavigatorProps = { navigator }

    switch(route.ident) {
      case "ArtistList":
        return (
          <ArtistList
            {...globalNavigatorProps} />
        );

      default:
        return (
          <Text>{`YO YOU MESSED SOMETHING UP ${route}`}</Text>
        )
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
        ref="appNavigator"
        style={styles.navigatorStyles}
        renderScene={this._renderScene}
        configureScene={(route) => ({
          ...route.sceneConfig || Navigator.SceneConfigs.FloatFromRight })} />
    )
  }

}

const styles = React.StyleSheet.create({

  navigatorStyles: {

  }

})

module.exports = AppNavigator
