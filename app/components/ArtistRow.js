import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class ArtistRow extends Component {
  render() {
    return (
      <TouchableHighlight onPress={ () => Actions.artistShow({ artist: this.props.artist}) } activeOpacity={ 100 } underlayColor="#ea4b54">
        <Image
          resizeMode='cover'
          source={{ uri:  (this.props.artist.image) ? this.props.artist.image : 'https://facebook.github.io/react/img/logo_og.png'  }}
        >
        <View style={ styles.container }>
          <Text style={ styles.artistName }>{ this.props.artist.name }</Text>
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
