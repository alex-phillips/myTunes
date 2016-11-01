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
    console.log("state", this.state);
    fetch(`http://${this.state.serverUrl}/api/me`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'email': this.state.email,
        'password': this.state.password,
      })
    })
    .then((response) => response.json())
    .then((json) => Actions.artistList({ token: json.token, serverUrl: this.state.serverUrl }))
    .catch((error) =>
      console.log(error)
    );


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
