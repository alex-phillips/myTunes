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
import Koel from '../api/Koel';

export default class ArtistRow extends Component {
  constructor() {
    super();
    this.state = {
      artistImage: 'https://facebook.github.io/react/img/logo_og.png',
    };
  }

  componentDidMount() {
    let self = this;
    console.log(`Fetching artist ${this.props.artist.name} spotify image`);
    fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(this.props.artist.name.toLowerCase())}&type=artist&market=US`)
      .then(response => response.json())
      .then(json => {
        self.props.artist.image = json.artists.items[0].images[0].url;
        self.setState({
          artistImage: self.props.artist.image,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <TouchableHighlight onPress={ () => {
        Koel.getInstance().getArtistsAlbums(this.props.artist.id)
          .then(albums => {
            Actions.artistShow({
              artist: this.props.artist,
              albums: albums,
            });
          })
          .catch(err => {
            console.log(err);
          });
      } } activeOpacity={ 100 } underlayColor="#ea4b54">
        <Image
          resizeMode='cover'
          key={this.state.artistImage}
          source={{ uri:  this.state.artistImage  }}
        >
          <View style={ styles.container }>
            <Text style={ styles.artistName }>{ this.props.artist.name }</Text>
            <Text style={ styles.artistSongs }>{ this.props.artist.albums.length } albums</Text>
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
