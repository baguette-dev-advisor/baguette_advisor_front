import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet, TextInput, StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from '../../../styles';
import NavSteps from './../../../fragments/NavSteps';

import {popAlert} from '../../../utils';
import I18n from '../../../i18n/i18n';

const { width } = Dimensions.get('window');

export default class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };

    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
  }

  onLeftPress() {
    this.props.navigation.goBack();
  }

  onRightPress() {
    if (!this.state.username) {
      return popAlert(I18n.t('errors.information.missing'), I18n.t('new.addUsername') + '.');
    }

    this.props.navigation.navigate('Upload', {
      ...this.props.navigation.state.params,
      username: this.state.username
    });
  }

  onUsernameChange(username) {
    this.setState({
      username
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120}  contentContainerStyle={_styles.container}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <View style={_styles.head}>
          <Text style={_styles.title}>{I18n.t('generics.welcome')}</Text>
        </View>

        <View style={_styles.inner}>
          <View style={_styles.box}>
            <Text style={_styles.boxTitle}>{I18n.t('new.usernameQuestion')}</Text>
            <View style={_styles.inputRow}>
              <TextInput
                placeholder={I18n.t('new.username')}
                placeholderTextColor='#DDD'
                selectionColor={styles.colors.primary}
                style={_styles.input}
                underlineColorAndroid="transparent"
                onChangeText={this.onUsernameChange}
                value={this.state.name}
                autoCorrect={false}
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
              />
              <Icon name='person' color='grey' />
            </View>
          </View>
        </View>

        <NavSteps
          left={I18n.t('generics.goBack')} 
          onLeftPress={this.onLeftPress} 
          leftColor='white' 
          step={3} 
          steps={4} 
          right={I18n.t('generics.validate')} 
          onRightPress={this.onRightPress} 
          rightColor={styles.colors.primary} 
        />
      </KeyboardAwareScrollView>
    );
  }
}

Info.propTypes = {
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
    paddingBottom: 80
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
  inner: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 16,
    marginRight: 16,
    marginTop: -80,
    position: 'relative',
    overflow: 'hidden'
  },
  picDesc: {
    marginTop: -10,
    color: 'white',
    fontSize: 22,
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 6,
    width: '100%',
    paddingBottom: 32,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 32
  },
  boxTitle: {
    color: '#313131',
    fontSize: 24,
    fontWeight: 'bold',
    flexShrink: 1,
    marginBottom: 16,
    marginLeft: 8,
    textAlign: 'left'
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    paddingTop: 8,
    paddingRight: 8,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    alignItems: 'center',

    borderRadius: 5,
    shadowColor: '#bbb',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  input: {
    height: 40,
    marginLeft: 16,
    flex: 1
  },
  ratings: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 16,
  },
  rateDesc: {
    color: 'black',
    fontSize: 18,
    marginLeft: 8,
    paddingBottom: 8,
  },
  takePic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: styles.colors.primary
  },
  pic: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: styles.colors.primary,
    resizeMode: 'cover'
  },
  picProgress: {
    position: 'absolute',
    top: '50%',
    width: '70%',
    left: '15%'
  },
});
