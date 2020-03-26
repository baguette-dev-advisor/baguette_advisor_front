import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, Platform, PermissionsAndroid} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CameraKitCamera } from 'react-native-camera-kit';
import ImagePicker from 'react-native-image-crop-picker';

import ProgressBar from 'react-native-progress/Bar';

import styles from '../../../styles';
import NavSteps from './../../../fragments/NavSteps';
import I18n from '../../../i18n/i18n';
import {popAlert} from '../../../utils';
import { upload } from '../../../providers/picture';


export default class Picture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      good: true
    };

    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
    this.takePic = this.takePic.bind(this);
  }

  onLeftPress() {
    this.props.navigation.goBack();
  }

  onRightPress() {
    if (!this.state.pic) {
      return popAlert(I18n.t('errors.information.missing'), I18n.t('new.addPicture') + '.');
    }
    if (this.state.uploading) {
      return popAlert(I18n.t('generics.wait'), I18n.t('new.upload') + '.');
    }
    this.props.navigation.navigate('Info', {
      ...this.props.navigation.state.params,
      pic: this.state.picId
    });
  }

  async takePic() {
    // ImagePicker.openCamera({
    //   width: 1280,
    //   height: 720,
    //   cropping: true,
    //   forceJpg: true,
    // }).then(image => {
    //   console.warn(image);
    // });

    // return
    if (Platform.OS === 'android') {
      let granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!granted) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            'title': 'Baguette Advisor',
            'message': 'Baguette Advisor need access to your camera'
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return popAlert(I18n.t('new.noCameraTitle'), I18n.t('new.noCameraDescription'));
        }
      }

      granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (!granted) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            'title': 'Baguette Advisor',
            'message': 'Baguette Advisor need access to your storage to store picture'
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return popAlert(I18n.t('new.noCameraTitle'), I18n.t('new.noCameraDescription'));
        }
      }

      granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (!granted) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            'title': 'Baguette Advisor',
            'message': 'Baguette Advisor need access to your storage to store picture'
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return popAlert(I18n.t('new.noCameraTitle'), I18n.t('new.noCameraDescription'));
        }
      }
    } else {
      const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
      if (!isCameraAuthorized) {
        const isUserAuthorizedCamera = await CameraKitCamera.requestDeviceCameraAuthorization();
        if (!isUserAuthorizedCamera) {
          return popAlert(I18n.t('new.noCameraTitle'), I18n.t('new.noCameraDescription'));
        }
      }
    }
    this.props.navigation.navigate('Camera', {
      onCapture: (img) => {
        this.setState({
          pic: (Platform.OS === 'android' ? 'file://' : '') + img.uri,
          uploading: true
        });

        // console.warn(img);

        upload(img.uri, 'markets')
          .then(id => {
            this.setState({
              uploading: false
            });
            this.setState({
              picId: id
            });
          })
          .catch(err => {
            this.setState({
              pic: null,
              uploading: false
            });
            popAlert(I18n.t('errors.default'), I18n.t('new.uploadFail'));
            log.error('Picture upload', err);
          });
      }
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120} contentContainerStyle={_styles.container}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <View style={_styles.head}>
          <Text style={_styles.title}>{I18n.t('generics.welcome')}</Text>
        </View>

        <View style={_styles.inner}>
          <TouchableOpacity onPress={this.takePic} style={{flexGrow: 0, flexShrink:0, width: '100%', aspectRatio: 1, position: 'relative'}}>

            {!this.state.pic &&
              <Image style={{flexGrow: 0, flexShrink:0, height: '100%', aspectRatio: 1}} source={require('../../../assets/store_with_add.png')} />
            }
            {this.state.pic &&
              <Image style={{flexGrow: 0, flexShrink:0, height: '100%', aspectRatio: 1}} source={{ uri: this.state.pic }} />
            }
            {this.state.uploading &&
              <ProgressBar height={16} borderRadius={10} style={_styles.picProgress} indeterminate={true} color={styles.colors.primary} />
            }

          </TouchableOpacity>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={_styles.todo}>{I18n.t('new.addPicture')}</Text>
          </View>
        </View>

        <NavSteps
          left={I18n.t('generics.goBack')} 
          onLeftPress={this.onLeftPress} 
          leftColor='white' 
          step={1} 
          steps={4} 
          right={I18n.t('generics.next')} 
          onRightPress={this.onRightPress} 
          rightColor={styles.colors.primary} 
        />
      </KeyboardAwareScrollView>
    );
  }
}

Picture.propTypes = {
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
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginLeft: 16,
    marginRight: 16,
    marginTop: -80,
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
  desc: {
    color: 'black',
    fontSize: 18,
    flexShrink: 1,
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'center'
  },
  todo: {
    color: 'black',
    fontSize: 28,
    textAlign: 'center'
  },
  picProgress: {
    position: 'absolute',
    top: '50%',
    width: '70%',
    left: '15%'
  },
});
