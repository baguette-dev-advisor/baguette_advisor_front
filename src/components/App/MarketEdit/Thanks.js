import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import styles from '../../../styles';
import I18n from '../../../i18n/i18n';
import Button from '../../../fragments/Button';


export default class Thanks extends Component {
  constructor(props) {
    super(props);

    this.onPressBack = this.onPressBack.bind(this);
  }

  onPressBack() {
    this.props.navigation.state.params.exit();
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120} contentContainerStyle={_styles.container}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <View style={_styles.hero}>
          <Text style={_styles.heroText}>{I18n.t('generics.thanks')}!</Text>
        </View>

        <Button title={I18n.t('new.done')} color='white' onPress={this.onPressBack}></Button>
      </KeyboardAwareScrollView>
    );
  }
}

Thanks.propTypes = {
  navigation: PropTypes.object
};

const _styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: styles.colors.primary,
    padding: 32,
  },
  hero: {
    flex: 1,
    alignSelf: 'stretch',
    height: undefined,
    width: undefined,
    justifyContent: 'center',
  },
  heroText: {
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 42,
  },
  heroBtn: {
    backgroundColor: styles.colors.primary,
  },
  btn: {
    marginTop: 32,
    marginBottom: 32,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnInner: {
    backgroundColor: 'white',
    color: styles.colors.primary,
    fontFamily: 'pacifico',
    textAlign: 'center',
    fontSize: 32,
    paddingBottom: 8
  },
});
