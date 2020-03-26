import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { DrawerActions } from 'react-navigation-drawer';
import Geolocation from '@react-native-community/geolocation';
import PropTypes from 'prop-types';

import Map from './../../fragments/Map';
import List from './../../fragments/List';

import styles from '../../styles';
import I18n from '../../i18n/i18n';
import log from '../../providers/log';

export default class Markets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMap: true
    };

    this.onSelect = this.onSelect.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.onMapPress = this.onMapPress.bind(this);
    this.onListPress = this.onListPress.bind(this);
  }

  async requestGeoPermission() {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return;
    }
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Baguette Geolocation Permission',
          'message': 'We needs access to your position ' +
                     'so you can locate best baguette.'
        }
      );
    } catch (err) {
      log.error('Grant geo', err);
    }
  }

  async componentDidMount() {
    await this.requestGeoPermission();

    Geolocation.getCurrentPosition(pos => {
      this.origin(pos.coords.latitude, pos.coords.longitude);
    }, function (err) {
      log.error('Get geo', err);
    });
  }

  origin(lat, long) {
    this.setState({
      map: {
        lat: lat,
        long: long
      }
    });
  }

  onSelect(id) {
    this.props.navigation.navigate('Market', { id });
  }

  openMenu() {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer())
  }

  onAdd(lat, long) {
    this.props.navigation.navigate('MarketEdit', {lat, long});
  }

  onMapPress() {
    this.setState({ showMap: true });
  }

  onListPress() {
    this.setState({ showMap: false });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: this.openMenu }}
          centerComponent={{ text: 'Baguette Advisor', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
          backgroundColor={styles.colors.primary}
          outerContainerStyles={{ position: 'relative' }}
          statusBarProps={{barStyle: 'light-content'}}
        />

        {this.state.showMap && !this.state.map &&
          <View style={_styles.noGeo}>
            <Icon name="gps-off" size={128} color={styles.colors.primary} />
            <Text style={_styles.text}>{I18n.t('errors.gps.off')}</Text>
          </View>
        }
        {this.state.showMap && this.state.map &&
          <Map lat={this.state.map.lat} long={this.state.map.long} onSelect={this.onSelect} onAdd={this.onAdd} />
        }

        {!this.state.showMap && <List lat={this.state.map.lat} long={this.state.map.long} onSelect={this.onSelect} />}

        {/* <View style={_styles.bottom}>
          <TouchableOpacity onPress={this.onMapPress} style={_styles.button}>
            <Text style={_styles.text} >Map</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onListPress} style={_styles.button}>
            <Text style={_styles.text} >List</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

Markets.propTypes = {
  navigation: PropTypes.object
};

const _styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: styles.colors.primary,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 40,
  },
  noGeo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 64,
    paddingLeft: 16,
    paddingRight: 16
  },
  text: {
    color: styles.colors.primary,
    fontSize: 24,
    paddingTop: 16
  }
});
