import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';

import styles from '../styles';
import { find } from './../providers/marketplace';
import {popAlert} from '../utils';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const DEFAULT_ZOOM = 20;

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: this.computeRegion(props.lat, props.long, props.zoom),
      markers: [],
      moved: false
    };

    // preload
    if (!this.props.markers) {
      this.load(this.state.region);
    } else {
      this.props.markers.forEach((m, i) => {
        this.state.markers.push({
          key: m.id || i,
          name: m.name,
          coordinate: {
            latitude: parseFloat(m.latitude),
            longitude: parseFloat(m.longitude)
          },
          color: '#FF0000'
        });
      });
    }

    this.touched = false;
    this.markers = this.state.markers;
    this.location = this.state.region;

    this.onMapReady = this.onMapReady.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  // TODO FIXME
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.lat != nextProps.lat || this.props.long != nextProps.long) {
      this.location = this.computeRegion(nextProps.lat, nextProps.long);
      this.setState({
        region: this.computeRegion(nextProps.lat, nextProps.long)
      });
    }
  }

  computeRegion(lat, long, zoom) {
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      latitudeDelta: 1 / (zoom || DEFAULT_ZOOM),
      longitudeDelta: 1 / (zoom || DEFAULT_ZOOM) * ASPECT_RATIO,
    }
  }

  load(location) {
    const xk = Math.abs(location.longitudeDelta * 110.574 * Math.cos(location.latitudeDelta * (180 / Math.PI)));
    const yk = Math.abs(location.latitudeDelta * 110.574);

    find(location.latitude, location.longitude, Math.max(xk, yk) * 1000)
      .then(markets => {
        var log = []
        markets.forEach(m => {
          log.push({id: m.id, name: m.name})
        });
        const markers = [];
        markets.forEach(m => {
          markers.push({
            key: m.id,
            name: m.name,
            coordinate: {
              latitude: parseFloat(m.latitude),
              longitude: parseFloat(m.longitude)
            },
            color: '#FF0000'
          });
        });

        this.markers = markers;
        if (!this.touched) {
          this.setState({
            markers,
            region: this.location
          });
        }
      }).catch(err => {
        // popAlert('Oops, something went wrong', 'Failed to load markets'); // TODO trad
      });
  }

  onMarkerPress(id) {
    return () => {
      if (this.props.onSelect) {
        this.props.onSelect(id);
      }
    };
  }

  onAdd() {
    this.props.onAdd(this.state.region.latitude, this.state.region.longitude);
  }

  onMove() {
    Geolocation.getCurrentPosition(pos => {
      this.location = this.computeRegion(pos.coords.latitude, pos.coords.longitude);
      this.setState({ region: this.location});
      this.load(this.location);
    });
    this.setState({ moved: false });
  }

  onMapReady() {
    this.setState({
      region: this.computeRegion(this.props.lat, this.props.long, this.props.zoom),
    });
  }

  onRegionChange(location) {
    this.touched = true;
    this.location = location;
  }

  onRegionChangeComplete(location) {
    this.setState({ region: location, markers: this.markers });

    Geolocation.getCurrentPosition(pos => {
      var dLat= Math.abs(location.latitude - pos.coords.latitude)
      var dLong= Math.abs(location.longitude - pos.coords.longitude)
      if (dLat > 0.01 || dLong > 0.01) {
        this.setState({ moved: true });
      }
    });

    // console.warn('changeComplete', this.touched, location.latitude, location.longitude)
    this.touched = false;
    this.location = location;
    if (!this.props.markers) {
      this.load(location);
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={(map) => { this.map = map; }}
          provider={this.props.provider}
          region={this.state.region}
          showsUserLocation={true}
          followsUserLocation={false}
          showsMyLocationButton={false}
          showsScale={true}
          onMapReady={this.onMapReady}
          onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
          style={{flex: 1}}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              title={marker.name}
              pinColor={marker.color}
              image={require('../assets/store_pin.png')}
              style={{height: 32}}
              onCalloutPress={this.onMarkerPress(marker.key)}
            />
          ))}
        </MapView>
        {this.props.onAdd &&
          <TouchableOpacity onPress={this.onAdd} style={{ position: 'absolute', bottom: 8, right: 8, height: 80, width: 80 }}> 
            <Icon onPress={this.onAdd} name='add' reverse={true} color='#00149a'/>
            <TouchableOpacity onPress={this.onAdd} style={{ borderColor: '#f11f2e', borderWidth: 6, width: 60, height: 60, borderRadius: 128, position: 'absolute', bottom: 17, right: 17 }} />
            <TouchableOpacity onPress={this.onAdd} style={{ borderColor: 'white', borderWidth: 6, width: 48, height: 48, borderRadius: 128, position: 'absolute', bottom: 23, right: 23 }} />
          </TouchableOpacity>
        }
        {this.state.moved &&
        <Icon raised name='adjust' onPress={this.onMove} containerStyle={{ position: 'absolute', top: 8, right: 8 }} reverse={true} color={styles.colors.primary} />
        }
      </View>
    );
  }
}

const _styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: styles.colors.primary,
  }
});
