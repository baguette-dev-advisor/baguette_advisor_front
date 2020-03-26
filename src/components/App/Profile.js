import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements'

import { logout } from '../../providers/user.js';

export default class Profile extends Component {
  constructor(props) {
    super(props);
  }

  onPressLogout() {
    logout();
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#ededed', paddingTop: 50 }}>
        <Button
        onPress={() => this.onPressLogout()}
        title="Logout"
      />
      </View>
    );
  }
}
