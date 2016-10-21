'use strict'

import React, { Component } from 'react';
import { View } from 'react-native'

class ViewContainer extends Component {
  render() {
    return (
      <View style={[styles.viewContainer, this.props.style || {}]}>
        <View style={[styles.statusBarBackground, this.props.style || {}]}>
        </View>
        {this.props.children}
      </View>
    )
  }
}

const styles = React.StyleSheet.create({

  viewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch"
  },

  statusBarBackground: {
    height: 20,
    backgroundColor: "white"
  }

})

module.exports = ViewContainer
