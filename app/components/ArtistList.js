import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
} from 'react-native';
import ArtistRow from './ArtistRow.js';
import { Data } from '../../mockKoelData.js';
import Koel from '../api/Koel';

export default class ArtistList extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  }

  componentDidMount() {
    Koel.getInstance().getArtists()
      .then(artists => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(artists),
        })
      })
      .catch(err => {
        console.log('error:', err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Artists
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(artist) => <ArtistRow artist={ artist } />}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#111',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
});
