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
    console.log(`Bearer ${this.props.token}`);
    fetch(`http://${this.props.serverUrl}/api/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.props.token}`
      },
    })
    .then((response) => response.json())
    .then((json) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(json.artists),
      });
    })
    .catch((error) =>
      console.log(error)
    );
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
