import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, StatusBar} from 'react-native';
import MapView from 'react-native-maps';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Geolocation from '@react-native-community/geolocation';

import styles from '../../../styles';
import NavSteps from './../../../fragments/NavSteps';
import I18n from '../../../i18n/i18n';
import { get } from '../../../providers/user.js';
import log from '../../../providers/log';

const DEFAULT_ZOOM = 100;

export default class MarketMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: props.navigation.state.params.lat,
        longitude: props.navigation.state.params.long,
        latitudeDelta: 1 / DEFAULT_ZOOM,
        longitudeDelta: 1 / DEFAULT_ZOOM * 1.2,
      },
      marker: {
        coordinate: {
          latitude: props.navigation.state.params.lat,
          longitude: props.navigation.state.params.long
        }
      }
    };
    this.user = get();

    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition(pos => {
      this.setState({
        region: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 1 / DEFAULT_ZOOM,
          longitudeDelta: 1 / DEFAULT_ZOOM * 1.2,
        },
        marker: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      });
    }, function (err) {
      log.error('Get geo', err);
    });
  }

  onLeftPress() {
    this.props.navigation.goBack();
  }

  onRightPress() {
    if (this.user.username) {
      this.props.navigation.navigate('Upload', {
        ...this.props.navigation.state.params,
        coordinate: this.state.marker.coordinate
      });
    } else {
      this.props.navigation.navigate('Username', {
        ...this.props.navigation.state.params,
        coordinate: this.state.marker.coordinate
      });
    }
  }

  onDragEnd(e) {
    this.setState({marker: e.nativeEvent});
  }

  onRegionChangeComplete(location) {
    this.setState({ region: location});
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardOpeningTime={120} contentContainerStyle={_styles.container}>
        <StatusBar barStyle='dark-content'></StatusBar>

        <View style={_styles.head}>
          <Text style={_styles.title}>{I18n.t('new.positionQuestion')}</Text>
          <Text style={_styles.desc}>{I18n.t('new.positionAdvice')}</Text>
        </View>

        <View style={_styles.inner}>
          <MapView
            region={this.state.region}
            showsUserLocation={false}
            followsUserLocation={false}
            showsMyLocationButton={false}
            showsScale={true}
            onRegionChangeComplete={this.onRegionChangeComplete}
            style={_styles.map}
          >
            <MapView.Marker
              coordinate={this.state.marker.coordinate}
              onDragEnd={this.onDragEnd}
              draggable
            />
          </MapView>
        </View>

        <NavSteps
          left={I18n.t('generics.goBack')} 
          onLeftPress={this.onLeftPress} 
          leftColor='white' 
          step={3} 
          steps={4} 
          right={I18n.t(this.user.username ? 'generics.validate' : 'generics.next')}
          onRightPress={this.onRightPress} 
          rightColor={styles.colors.primary} 
        />
      </KeyboardAwareScrollView>
    );
  }
}

MarketMap.propTypes = {
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
    // display: 'flex',
    justifyContent: 'center',
    paddingTop: 16,
  },
  inner: {
    flex: 1,
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
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
    textAlign: 'center'
  },
  map: {
    flex: 1,
    alignSelf: 'stretch'
  },
});
