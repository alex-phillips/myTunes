
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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ArtistRow from './ArtistRow.js';
import Koel from '../api/Koel';
import Icon from 'react-native-vector-icons/Ionicons';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 280;
const STICKY_HEADER_HEIGHT = 50;
const AVATAR_SIZE = 120;

export default class ArtistDetails extends Component {

  renderStickyHeader() {
  return(
      <View style={ styles.stickySection }>
        <Text style={ styles.stickySectionTitle }>{ this.props.artist.name }</Text>
      </View>
    );
  }

  renderForeground() {
    return(
      <View key="parallax-header" style={ styles.parallaxHeader }>
        <Image style={ styles.avatar } source={{
          uri:  (this.props.artist.image) ? this.props.artist.image : 'https://facebook.github.io/react/img/logo_og.png',
          width: AVATAR_SIZE,
          height: AVATAR_SIZE
        }}/>
        <Text style={ styles.artistName }>
          { this.props.artist.name }
        </Text>
      </View>
    );
  }

  renderBackground() {
    return(
      <View key="background" style={ styles.background }>
        <Image source={{uri: (this.props.artist.image) ? this.props.artist.image : 'https://facebook.github.io/react/img/logo_og.png',
                        width: window.width,
                        height: PARALLAX_HEADER_HEIGHT}}/>
        <View style={ styles.backgroundOverlay }/>
      </View>
    );
  }

  renderSongsList() {
    // TODO: maybe show albums here instead?
    const albumsDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows( this.props.albums );
    return(
      <ListView
        dataSource={ albumsDataSource }
        style={ styles.songsList }
        // renderRow={(album) => <ArtistRow artist={ album } />}/>
        renderRow={(album, sectionId, rowId) => (
          <TouchableHighlight activeOpacity={ 100 } underlayColor="rgba(246, 41, 118, 0.6)">
            <View key={album} style={ styles.song }>
              <Text style={ styles.songTitle } onPress={ () => {
                Koel.getInstance().getAlbum(album.id)
                  .then((album) => {
                    Actions.albumShow({ artist: this.props.artist, album: album })
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }}>
                { album.name }
              </Text>
            </View>
          </TouchableHighlight>
          )
        }
      />
    );
  }

  render() {
    const { onScroll = () => {} } = this.props;
    return (
      <View style={styles.container}>
        <ParallaxScrollView
          style={ { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, width: window.width, height: window.height } }
          parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
          stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
          onScroll={onScroll}
          renderStickyHeader={ this.renderStickyHeader.bind(this) }
          renderForeground={ this.renderForeground.bind(this) }
          renderBackground={ this.renderBackground.bind(this) }>
          { this.renderSongsList() }
        </ParallaxScrollView>
        <View style={ styles.headerClose }>
          <Icon onPress={ Actions.pop } name="ios-arrow-back" size={30} color="#fff" style={{backgroundColor: "rgba(0, 0, 0, 0)"}}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000"
  },
  background: {
    backgroundColor: "#000",
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    width: window.width,
    backgroundColor: 'rgba(0,0,0,.8)',
    height: PARALLAX_HEADER_HEIGHT
  },
  headerClose: {
    position: 'absolute',
    top: 5,
    left: 0,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickySectionTitle: {
    color: "#FFF",
  },
  parallaxHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    width: window.width,
  },
  artistName: {
    fontSize: 23,
    color: "#FFF",
    fontFamily: "Helvetica Neue",
  },
  avatar: {
    marginBottom: 12,
    borderRadius: AVATAR_SIZE / 2
  },
  playButton: {
    marginTop: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 70,
    paddingRight: 70,
    backgroundColor: "#f62976",
    borderRadius: 200,
  },
  playButtonText: {
    color: "#FFF",
    fontFamily: "Helvetica Neue",
    fontSize: 13,
  },
  songsList: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 5,
    height: window.height - STICKY_HEADER_HEIGHT,
  },
  song: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#111",

  },
  songTitle: {
    color: "white",
    fontFamily: "Helvetica Neue",
    marginBottom: 5,
  },
  albumTitle: {
    color: "#BBB",
    fontFamily: "Helvetica Neue",
    fontSize: 12
  },
});
