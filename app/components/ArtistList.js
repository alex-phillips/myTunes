import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TextInput,
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

  _sortByName(a, b) {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  }

  componentDidMount() {
    Koel.getInstance().getArtists()
      .then(artists => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(artists.sort(this._sortByName)),
        })
      })
      .catch(err => {
        console.log('error:', err);
      });
  }

  setSearchText(event) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    let searchText = event.nativeEvent.text,
      self = this;
    this.setState({searchText});

    this.searchTimeout = setTimeout(() => {
      Koel.getInstance().searchArtists(searchText)
        .then(artists => {
          self.setState({
            dataSource: self.state.dataSource.cloneWithRows(artists.sort(self.__sortByName)),
          })
        });
    }, 1000)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Artists
        </Text>
        <TextInput
         style={styles.searchBar}
         value={this.state.searchText}
         onChange={this.setSearchText.bind(this)}
         placeholder="Search" />
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
  searchBar: {
    height: 40,
    fontFamily: 'HelveticaNeue-Medium',
    backgroundColor: '#303030',
    color: '#FFF',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 2,
  },
});
