import React from 'react';
import { Dimensions, Text, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import ImageFallback from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { Rating } from 'react-native-elements';

import { find } from '../providers/marketplace';
import styles from '../styles';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const DEFAULT_ZOOM = 20;

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: props.lat,
        longitude: props.long,
        latitudeDelta: 1 / (props.zoom || DEFAULT_ZOOM),
        longitudeDelta: 1 / (props.zoom || DEFAULT_ZOOM) * ASPECT_RATIO,
      },
      markets: [],
    };

    // preload
    if (!this.props.markets) {
      this.load(this.state.region);
    } else {
      this.state.markets = this.props.markets;
    }
  }

  load(location) {
    const xk = Math.abs(location.longitudeDelta * 110.574 * Math.cos(location.latitudeDelta * (180 / Math.PI)));
    const yk = Math.abs(location.latitudeDelta * 110.574);

    find(location.latitude, location.longitude, Math.max(xk, yk) * 1000)
      .then(markets => {
        this.setState({
          markets
        });
      });
  }

  onEntryPress(id) {
    return () => {
      if (this.props.onSelect) {
        this.props.onSelect(id);
      }
    };
  }

  renderError() {
    return (
      <Image
        source={require('../assets/takepic.png')}
        style={_styles.avatar}
      />);
  }

  render() {
    return (
      <ScrollView style={{backgroundColor: 'white'}}>
        {this.state.markets.map(m => (
          <TouchableOpacity key={m._id} onPress={this.onEntryPress(m._id)}>
            <View style={_styles.row}>
              <View style={{ aspectRatio: 1.77 }}>
                <ImageFallback
                  source={{ uri: m.picture.url }}
                  renderError={this.renderError}
                  indicator={ProgressBar}
                  indicatorProps={{color: 'white'}}
                  style={_styles.avatar}
                  resizeMode="cover"
                />
              </View>

              <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'stretch' }}>
                <Text style={_styles.title} numberOfLines={1}>{m.name}</Text>

                <Text style={_styles.address}>{m.address.number} {m.address.street}</Text>
                <Text style={_styles.address}>{m.address.zip} {m.address.city}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={_styles.distance}>{m.distance}m</Text>
                  <Rating
                    type="star"
                    fractions={1}
                    startingValue={3.6}
                    readonly
                    imageSize={14}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
}


const _styles = {
  row: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    margin: 10
  },
  avatar: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: styles.colors.primary,
    height: undefined,
    width: undefined,
    marginRight: 5
  },
  title: {
    color: styles.colors.primary,
    fontSize: 18,
    flexShrink: 1
  },
  distance: {
    color: styles.colors.secondary,
    fontSize: 14,
  },
  address: {
    color: styles.colors.lightGray,
    fontSize: 14,
    flexShrink: 1
  }
};
