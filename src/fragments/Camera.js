import React, { Component } from 'react';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import ImagePicker from 'react-native-image-crop-picker';

import CONST from '../core/const';

export default class CameraScreen extends Component {

  onBottomButtonPressed(event) {
    if (event.type === 'left') {
      this.props.navigation.goBack();
      return;
    }

    if (event.type === 'capture') {
      this.props.navigation.state.params.onCapture(event.captureImages[0]);
      this.props.navigation.goBack();
      return;
    }
  }

  render() {
    return (
      <CameraKitCameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        flashImages={{
          on: require('../assets/camera/flashOn.png'),
          off: require('./../assets/camera/flashOff.png'),
          auto: require('./../assets/camera/flashAuto.png')
        }}
        // allowCaptureRetake={true} FIXME https://github.com/wix/react-native-camera-kit/blob/master/src/CameraScreen/CameraKitCameraScreenBase.js#L267
        cameraOptions={{
          ratioOverlay: '16:9'
        }}
        cameraFlipImage={require('./../assets/camera/cameraFlipIcon.png')}
        captureButtonImage={require('./../assets/camera/cameraButton.png')}
      />
    );
  }
}


