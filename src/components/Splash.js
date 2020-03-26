import React, { Component } from 'react';
import { View, Text} from 'react-native';
import styles from '../styles';


export default class Splash extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
        <Text>Hello</Text>
      </View>
    );
  }
}
