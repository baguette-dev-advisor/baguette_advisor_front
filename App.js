/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import {Platform, StyleSheet, Text, View} from 'react-native';


import { load as userLoad, onUpdate as onUserUpdate } from './src/providers/user';

import Splash from './src/components/Splash';
import App from './src/components/App';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: {}
    };

    userLoad().then((user) => {
      this.setState({
        loading: false,
        user
      });
      // SplashScreen.hide();
    });

    onUserUpdate(user => {
      this.setState({
        user
      });
    });
  }

  render() {
    return (
      this.state.loading ? (<Splash/>) : (
        <App/>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const AppNavigator = createStackNavigator({
  Home: { screen: Main },
}, {
  headerMode: 'none'
})

export default createAppContainer(AppNavigator);
