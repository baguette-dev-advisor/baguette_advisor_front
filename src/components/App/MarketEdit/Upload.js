import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, StatusBar} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from 'react-native-progress/Bar';

import styles from '../../../styles';
import {popAlert} from '../../../utils';
import { create } from '../../../providers/marketplace';
import log from '../../../providers/log';
import I18n from '../../../i18n/i18n';

import { setUsername } from '../../../providers/user.js';

export default class Upload extends Component {
  constructor(props) {
    super(props);

    const exit = this.props.navigation.state.params.exit;

    function c (){
      create(p.name, p.products, p.pic, p.coordinate)
        .then(() => {
          props.navigation.navigate('Thanks', {exit});
        })
        .catch(err => {
          log.error('Market creation', err);
          popAlert(I18n.t('errors.default'), I18n.t('generics.pleaseRetry'));
          props.navigation.goBack();
        });
    }

    const p = props.navigation.state.params;
    if (p.username) {
      setUsername(p.username)
        .then(()=>{
          c();
        }).catch(err => {
          popAlert(I18n.t('errors.default'), err);
          props.navigation.goBack();
        });
    } else {
      c();
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120} contentContainerStyle={_styles.container}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <View style={_styles.head}>
          <Text style={_styles.title}>{I18n.t('new.creation')}</Text>
        </View>

        <View style={_styles.inner}>
          <ProgressBar height={16} borderRadius={10} style={_styles.progress} indeterminate={true} color={styles.colors.primary} />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

Upload.propTypes = {
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
    paddingTop: 16
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 16,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden'
  },
  title: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    flexShrink: 1,
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center'
  },
  progress: {
    width: '70%'
  }
});
