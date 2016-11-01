import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Koel from '../api/Koel';

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      serverUrl: "",
      email: "",
      password: "",
    }
  }

  _onPressButton() {
    console.log("[LoginScreen - _onPressButton] state", this.state);
    let api = Koel.getInstance(this.state.serverUrl);
    api.login(this.state.email, this.state.password, err => {
      if (err) {
        return console.log(err);
      }

      Actions.artistList();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputField}
          onChangeText={(serverUrl) => this.setState({serverUrl})}
          value={this.state.serverUrl}
          placeholder='Server URL'
          placeholderTextColor='#FFF'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          placeholder='Email'
          placeholderTextColor='#FFF'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.inputField}
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          placeholder='Password'
          placeholderTextColor='#FFF'
          autoCapitalize='none'
        />
        <TouchableHighlight style={styles.loginButton} onPress={this._onPressButton.bind(this)}><Text style={styles.loginButtonText}>Login</Text></TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#191414',
  },
  inputField: {
    height: 40,
    fontFamily: 'HelveticaNeue-Medium',
    backgroundColor: '#303030',
    color: '#FFF',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 2,
  },
  loginButton: {
    height: 40,
    marginTop: 8,
    backgroundColor: '#1DB954',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
