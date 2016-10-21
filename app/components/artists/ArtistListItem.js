'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  ListView,
  View,
  Image,
} from 'react-native';
import Button from 'react-native-button';
import { Artists } from '../../mockData';


class ArtistListItem extends Component {
  render() {
    return (
      <TouchableHighlight onPress={() => this.props.showArtist(this.props.artist) }>
        <Image
          style={ styles.artistBg }
          resizeMode='cover'
          source={{uri:  this.props.artist.background  }}
        >
        <View style={ styles.container }>
          <Text style={ styles.artistName }>{ this.props.artist.name }</Text>
          <Text style={ styles.artistSongs }>{ this.props.artist.songs.length } songs</Text>
        </View>
        </Image>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingTop: 20,
    paddingBottom: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  artistName: {
    color: "#FFF",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "500",
    fontSize: 18,
    marginBottom: 5
  },
  artistSongs: {
    color: "#CCC",
    backgroundColor: 'transparent',
    fontFamily: "Helvetica Neue",
    fontWeight: "300",
    fontSize: 14
  },
});

module.exports = ArtistListItem;
