import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StackNavigator } from 'react-navigation';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './Home';
import Picture from './Picture';
import Info from './Info';
import Map from './Map';
import Username from './Username';
import Upload from './Upload';
import Thanks from './Thanks';
import Camera from './../../../fragments/Camera';
import HomeUser from './../../Home';

export default class MarketEdit extends Component {
  constructor(props) {
    super(props);

    const EditNavigator = createStackNavigator({
      Home: {screen: Home},
      HomeUser: {screen: HomeUser},
      Picture: {screen: Picture},
      Info: {screen: Info},
      Map: {screen: Map},
      Username: {screen: Username},
      Upload: {screen: Upload, navigationOptions: () => ({gesturesEnabled: false})},
      Thanks: {screen: Thanks, navigationOptions: () => ({gesturesEnabled: false})},
      Camera: {screen: Camera},
    }, {
      initialRouteName: 'Home',
      initialRouteParams: {
        ...this.props.navigation.state.params,
        exit:   props.navigation.goBack
      },
      headerMode: 'none'
    });

    const EditNav = createAppContainer(EditNavigator);

    this.nav = <EditNav ref={nav => { this.navigator = nav; }} />;
  }
  render() {
    return this.nav;
  }
}

MarketEdit.propTypes = {
  navigation: PropTypes.object
};
