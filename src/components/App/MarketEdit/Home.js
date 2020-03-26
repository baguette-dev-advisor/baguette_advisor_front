import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from '../../../styles';
import NavSteps from './../../../fragments/NavSteps';
import {load} from './../../../providers/user';
import I18n from '../../../i18n/i18n';


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
  }

  onLeftPress() {
    this.props.navigation.state.params.exit();
  }

  onRightPress() {
    load().then(user => {
      if (!user.handle) {
        this.props.navigation.navigate('HomeUser', {
          next: () => this.props.navigation.navigate('Picture', this.props.navigation.state.params)
        });
      } else {
        this.props.navigation.navigate('Picture', this.props.navigation.state.params);
      }
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120} contentContainerStyle={_styles.container}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <View style={_styles.head}>
          <Image
            source={require('../../../assets/login_signup_logo.png')}
            style={{ height: 100, justifyContent: 'center', resizeMode: 'contain' }}
          />
        </View>

        <View style={_styles.inner}>
          {/* <Image source={require('../../../assets/logo.png')} /> */}
          
          <Text style={_styles.title}>{I18n.t('new.title')}</Text>
          <Text style={_styles.desc}>{I18n.t('new.description')}</Text>
        </View>

        <NavSteps
          left={I18n.t('generics.cancel')} 
          onLeftPress={this.onLeftPress} 
          leftColor='white' 
          step={0} 
          steps={4} 
          right={I18n.t('generics.start')} 
          onRightPress={this.onRightPress} 
          rightColor={styles.colors.primary} 
        />
      </KeyboardAwareScrollView>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.object
};

const _styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: styles.colors.background
  },
  head: {
    height: 200,
    backgroundColor: styles.colors.primary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 16,
    marginRight: 16
  },
  title: {
    color: styles.colors.primary,
    fontSize: 28,
    fontWeight: 'bold',
    flexShrink: 1,
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center'
  },
  desc: {
    color: 'black',
    fontSize: 18,
    flexShrink: 1,
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'center'
  },
});
