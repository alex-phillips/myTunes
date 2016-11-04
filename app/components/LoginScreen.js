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
    console.log("[LoginScreen][_onPressButton] state", this.state);
    let self = this;
    Koel.resetInstance().getInstance(this.state.serverUrl)
      .login(this.state.email, this.state.password)
        .then(() => {
          self._onLogin();
        })
        .catch(err => {
          console.log(err);
        });
  }

  _onLogin() {
    Actions.loading();
    Koel.getInstance().getLibrary()
      .then(() => {
        Actions.artistList();
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    // Try to login with saved credentials
    let self = this;
    Koel.getInstance().ping()
      .then(() => {
        self._onLogin();
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
          secureTextEntry={true}
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
