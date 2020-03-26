import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Signin  from './Signin';
import Signup  from './Signup';

export default class Home extends Component {
  constructor(props) {
    super(props);

    const HomeNavigator = createStackNavigator({
      Signin: {screen: Signin},
      Signup: {screen: Signup}
    }, {
      initialRouteName: 'Signin',
      initialRouteParams: {
        ...this.props.navigation.state.params,
        exit:   props.navigation.goBack
      },
      headerMode: 'none'
    });

    const HomeNav = createAppContainer(HomeNavigator);

    this.nav = <HomeNav ref={nav => { this.navigator = nav; }} />;
  }
  render() {
    return this.nav;
  }
}

Home.propTypes = {
  navigation: PropTypes.object
};
