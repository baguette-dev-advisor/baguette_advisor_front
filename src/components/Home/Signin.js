import React, { Component } from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, StatusBar, ScrollView, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import Overlay from 'react-native-modal-overlay';
import ProgressCircle from 'react-native-progress/Circle';

import { signin } from '../../providers/user.js';
import I18n from '../../i18n/i18n';
import styles from '../../styles';
import CONST from '../../core/const';

export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: '',
      password: '',
      err: '',
      showPass: false,
      loading: false
    };

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
    this.onPressConnect = this.onPressConnect.bind(this);
    this.onPressSignup = this.onPressSignup.bind(this);
    this.onPressLostpass = this.onPressLostpass.bind(this);
    this.onShowPass = this.onShowPass.bind(this);
    this.onHidePass = this.onHidePass.bind(this);
    this.onExit = this.onExit.bind(this);
  }

  onHandleChange(handle) {
    this.setState({ handle });
  }

  onHandleSubmit() {
    this.passwordInput.focus();
  }

  onPasswordChange(password) {
    this.setState({ password });
  }

  onPasswordSubmit() {
    this.onPressConnect();
  }

  onPressConnect() {
    this.handleInput.blur();
    this.passwordInput.blur();
    this.setState({ loading: true });
    signin(this.state.handle, this.state.password)
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.state.params.exit();
        this.props.navigation.state.params.next();
      })
      .catch(err => {
        this.setState({ err, loading: false });
      });
  }

  onExit() {
    this.props.navigation.state.params.exit();
  }

  onPressLostpass() {
    Linking.openURL(CONST.API_BASE + '/recover');
  }

  onPressSignup() {
    this.props.navigation.navigate('Signup', {
      ...this.props.navigation.state.params,
      handle: this.state.handle
    });
  }

  onShowPass() {
    this.setState({ showPass: true });
  }

  onHidePass() {
    this.setState({ showPass: false });
  }

  render() {
    const err = this.state.err ? <Text style={_styles.err}>{this.state.err}</Text> : <Text></Text>;
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120} contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar barStyle="light-content"></StatusBar>
          <ScrollView style={{ flex: 1, backgroundColor: 'rgba(240,240,240,1)' }}>
            <ImageBackground source={require('../../assets/home.jpg')} style={{ width: null, height: 280 }} blurRadius={8}>
              <View style={{ flex: 1, padding: 16, justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 30, paddingBottom: 62 }}>
                {this.props.navigation.state.params.exit &&
                  <Icon containerStyle={_styles.back} name="arrow-back" size={24} color='white' onPress={this.onExit} />
                }
                <Image source={require('../../assets/login_signup_logo.png')} style={{height: 120, justifyContent: 'center', resizeMode: 'contain', marginBottom: -32}}></Image>
                <Text style={_styles.ba}><Text style={{fontWeight: 'bold'}}>Baguette</Text> Advisor</Text>
              </View>
            </ImageBackground>

            <View style={{ flex: 2, padding: 24, justifyContent: 'space-between', alignItems: 'center', top: -32, marginLeft: 16, marginRight: 16, backgroundColor: 'white', borderRadius: 6 }}>
              <View style={{ flex: 1, justifyContent: 'space-between', width: '100%'}}>
                <View>
                  {/* //TODO trad  */}
                  <Text style={_styles.title}>Login</Text>
                  <View style={{width: 25, borderBottomWidth: 8, borderColor: 'black'}}></View>
                </View>
                { err }

                <Text style={_styles.inputTitle}>{I18n.t('home.email')}</Text>
                <View style={_styles.inputRow}>
                  <TextInput
                    ref={(c) => { this.handleInput = c; }}
                    style={_styles.input}
                    underlineColorAndroid="transparent"
                    onChangeText={this.onHandleChange}
                    onSubmitEditing={this.onHandleSubmit}
                    value={this.state.handle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    enablesReturnKeyAutomatically={true}
                  />
                  <Icon name='mail' color='#b8b8b8' />
                </View>
                <Text style={_styles.inputTitle}>{I18n.t('home.password')}</Text>
                <View style={_styles.inputRow}>
                  <TextInput
                    ref={(c) => { this.passwordInput = c; }}
                    style={_styles.input}
                    underlineColorAndroid="transparent"
                    onChangeText={this.onPasswordChange}
                    onSubmitEditing={this.onPasswordSubmit}
                    value={this.state.password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!this.state.showPass}
                    returnKeyType="done"
                    enablesReturnKeyAutomatically={true}
                  />
                  { !this.state.showPass && <Icon name='visibility' color='#b8b8b8' onPress={this.onShowPass} /> }
                  { this.state.showPass && <Icon name='visibility-off' color='#b8b8b8' onPress={this.onHidePass} /> }
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TouchableOpacity onPress={this.onPressSignup}>
                    <Text style={_styles.outline}>{I18n.t('home.signup')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.onPressLostpass}>
                    <Text style={_styles.lostpass}>{I18n.t('home.lostPass')}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this.onPressConnect} style={_styles.btn}>
                  <Text style={_styles.btnInner}>{I18n.t('home.signin')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <Overlay visible={this.state.loading}
            animationType="zoomIn"
            childrenWrapperStyle={{backgroundColor: 'transparent'}}
            containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.78)'}}
            animationDuration={0}>
            {/* <ProgressCircle size={90} borderWidth={3} indeterminate={true} borderColor={styles.colors.primary} /> */}
          </Overlay>
      </KeyboardAwareScrollView>
    );
  }
}

Signin.propTypes = {
  navigation: PropTypes.object
};

const _styles = {
  ba: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: 'transparent',
    lineHeight: 32,
    overflow: 'visible'
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'left',
    backgroundColor: 'transparent',
    lineHeight: 32,
    overflow: 'visible',
    paddingTop: 16
  },
  inputTitle: {
    color: '#b8b8b8',
    fontSize: 20,
    textAlign: 'left',
    backgroundColor: 'transparent',
    lineHeight: 32
  },
  back: {
    position: 'relative',
    top: 16,
    alignSelf: 'flex-start',
    marginBottom: -32
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 16,
    paddingBottom: 8,
    paddingTop: 8,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#dadada',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5
  },
  input: {
    height: 40,
    flexGrow: 1,
    marginLeft: 8,
    color: 'black'
  },
  btn: {
    marginTop: 32,
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnInner: {
    backgroundColor: styles.colors.primary,
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16
  },
  lostpass: {
    color: 'black',
    backgroundColor: 'transparent',
    marginRight: 8,
    marginTop: 8,
    textDecorationLine: 'underline'
  },
  outline: {
    color: 'black',
    backgroundColor: 'transparent',
    marginLeft: 8,
    marginTop: 8,
  },
  outlineUnder: {
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline'
  },
  err: {
    backgroundColor: '#E53935',
    padding: 8,
    color: 'white',
    borderRadius: 8,
    overflow: 'hidden'
  }
};
