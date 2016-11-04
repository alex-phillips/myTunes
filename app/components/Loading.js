
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Dimensions,
  ListView,
  ActivityIndicator,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ArtistRow from './ArtistRow.js';
// TODO: Add font to xcode project; see https://github.com/oblador/react-native-vector-icons
// import Icon from 'react-native-vector-icons/Ionicons';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 280;
const STICKY_HEADER_HEIGHT = 50;
const AVATAR_SIZE = 120;

export default class Loading extends Component {
  render() {
    const { onScroll = () => {} } = this.props;
    return (
      <View>
        <ActivityIndicator
          animating={true}
          style={[styles.centering, {height: 80}]}
          size="large"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    padding: 8
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
});
