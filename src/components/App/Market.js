import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, TouchableHighlight, ImageBackground } from 'react-native';
import ImageFallback from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { Icon, Header, Button } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import PropTypes from 'prop-types';

import {load} from './../../providers/user';
import { get, rate } from './../../providers/marketplace';
import styles from '../../styles';

import I18n from '../../i18n/i18n';
import log from '../../providers/log';

export default class Market extends Component {
  constructor(props) {
    super(props);

    this.images = {
      baguette: <Image source={require('../../assets/baguette_img.png')} style={_styles.rowIcon} />,
      croissant: <Image source={require('../../assets/croissant_img.png')} style={_styles.rowIcon} />,
      // brioche: <Image source={require('../../assets/croissant_img.png')} style={_styles.rowIcon} />,
      sandwich: <Image source={require('../../assets/sandwich_img.png')} style={_styles.rowIcon} />,
      pain_choco: <Image source={require('../../assets/pain_choco_img.png')} style={_styles.rowIcon} />,
      pain_bio: <Image source={require('../../assets/pain_bio_img.png')} style={_styles.rowIcon} />,
    }

    this.state = get(this.props.navigation.state.params.id) || {};
    this.state.productsArr = []
    Object.keys(this.state.products).forEach((key) => {
      // FIXME
      if (key === 'brioche') {
        return
      }
      // console.warn(this.state.products[key])
      this.state.productsArr.push(this.state.products[key])
    })

    this.state.markers = [{
      id: this.props.navigation.state.params.id,
      name: this.state.name,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }];

    this.state.showOver = false;
    this.productOver = this.state.productsArr[0];
    this.state.good = true;

    this.onBackPress = this.onBackPress.bind(this);
    this.onRate = this.onRate.bind(this);
    this.onClose = this.onClose.bind(this);
    this.rate = this.rate.bind(this);
    this.ratingCompleted= this.ratingCompleted.bind(this);
  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  onRate(product) {
    const self = this;
    return function () {
      self.productOver = self.state.products[product]
      console.warn(self.state.products[product])
      load().then(user => {
        if (!user.handle) {
          self.props.navigation.navigate('HomeUser', {
            next: () => {
              setTimeout(() => {
                self.setState({showOver: true});
              });
            }
          });
        } else {
          self.setState({showOver: true});
        }
      });
    }
  }

  onClose() {
    this.setState({showOver: false});
  }

  ratingCompleted(good) {
    return () => {
      this.setState({
        good
      });
    };
  }
  
  rate() {
    rate(this.props.navigation.state.params.id, this.productOver.id, this.state.good ? 1 : -1, '....')
      .then(() => {
        this.setState({
          ...get(this.props.navigation.state.params.id)
        });
      })
      .catch(err => {
        log.error('rate', err);
      });

    this.setState({showOver: false});
  }

  renderError() {
    return (
      <Image
        source={require('../../assets/takepic.png')}
        style={_styles.hero}
      />);
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#e0e0e0' }}>
        <Header
          leftComponent={<TouchableOpacity style={{marginLeft: 4, background: 'crimson', width: 14, height: 24}} onPress={this.onBackPress}><Image source={require('../../assets/back_arrow.png')} style={{width: 14, height: 24}} /></TouchableOpacity>}
          // leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: this.onBackPress }}  40x68
          centerComponent={{ text: this.state.name, style: { color: '#fff', fontSize: 16, fontWeight: 'bold' } }}
          backgroundColor={styles.colors.primary}
        />

        <View style={{ aspectRatio: 1.77, position: 'relative', overflow: 'visible' }}>
          <ImageFallback
            source={{ uri: this.state.picture }}
            renderError={this.renderError}
            indicator={ProgressBar}
            indicatorProps={{color: 'white'}}
            style={_styles.hero}
            resizeMode="cover"
          />
          <View style={_styles.info}>
            <View style={{flex: 1}}>
              <View style={{display: 'flex', flexDirection: 'row', overflow: 'hidden', justifyContent: 'flex-start'}}>
                <Text style={{color: 'black', fontWeight: 'bold', flexShrink: 1, fontSize: 16, paddingTop: 4, paddingRight: 8}} ellipsizeMode="tail" numberOfLines={1}>{this.state.name}</Text>
                <Image source={require('../../assets/certif_icon.png')} style={{width: 24, height: 24}} />
              </View>
              <Text style={{color: '#5f5f5f', paddingTop: 8, fontWeight: '500'}}>Ouvert de 9:00 à 21:00</Text>
              <Text style={{color: '#5f5f5f', paddingTop: 8, fontWeight: '500', fontSize: 11}}>{I18n.t('market.addedBy')}&nbsp;{this.state.hunter.username}</Text>
            </View>
          </View>
        </View>

        <View style={_styles.item}>
        {this.state.productsArr.map(p => (
          <TouchableOpacity style={_styles.row} key={p.name} onPress={this.onRate(p.name)}>
            {this.images[p.name]}
            <View style={_styles.rowInner}>
              <View style={_styles.product}>
                <Text style={_styles.rowTitle}>{I18n.t('products.' + p.name)}</Text>
                <Text style={{flex: 1}}>&nbsp;</Text>
                <View style={_styles.notation}>
                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>{Math.round((p.rating < 0 ? 50: p.rating) / 100 * 50)/10}</Text>
                  <Icon name="star" size={16} color='black' onPress={this.onExit} />
                </View>
              </View>
            </View>
            <View>
              <Image name='add' source={require('../../assets/rate_btn.png')} style={_styles.rowRight} />
            </View>
          </TouchableOpacity>
        ))}
        </View>


        <Overlay visible={this.state.showOver}
          onClose={this.onClose}
          closeOnTouchOutside animationType="zoomIn"
          containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.68)'}}
          childrenWrapperStyle={{backgroundColor: '#fff', padding: 0, borderRadius: 8, overflow: 'hidden'}}
          animationDuration={50}>          
            <Image source={require('../../assets/store_over.png')} style={{ width: '100%', height: 180 }} resizeMode='stretch'></Image>
            <TouchableOpacity style={{width: 64, height: 64, position: 'absolute', top: 0, right: 0}} onPress={this.onClose}></TouchableOpacity>

            <Text style={_styles.overTitle}>{I18n.t('market.note')}</Text>
            <Text style={_styles.overDesc}>{I18n.t('market.noteText')} {I18n.t('products.' + this.productOver.name)}.</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Icon
                name='thumb-down'
                size={25}
                color={styles.colors.primary}
                raised
                reverse={!this.state.good}
                onPress={this.ratingCompleted(false)}
                containerStyle={{'borderRadius': 5, paddingRight: 24}}
              />
              <Icon
                name='thumb-up'
                size={25}
                color={styles.colors.primary}
                raised
                reverse={this.state.good}
                onPress={this.ratingCompleted(true)}
                containerStyle={{'borderRadius': 5}}
              />
            </View>
            <View style={{display: 'flex', flexDirection: 'column', marginTop: 16, marginBottom: 16, width: '100%', alignItems: 'stretch', paddingLeft: 24, paddingRight: 24}}>
              <Button title={I18n.t('market.validate')} buttonStyle={{backgroundColor: styles.colors.primary}} color="#2196F3" onPress={this.rate}/>
            </View>
        </Overlay>

        {/* <View style={_styles.container}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text
              style={_styles.title}
              numberOfLines={3}
            >{this.state.name}</Text>
            <Rating
              type="star"
              fractions={1}
              startingValue={3.6}
              readonly
              imageSize={22}
              style={{ marginLeft: 5 }}
            />
          </View>

          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{flexGrow: 1}}>
              <Text style={_styles.address}>{this.state.address.number} {this.state.address.street}</Text>
              <Text style={_styles.address}>{this.state.address.zip}</Text>
              <Text style={_styles.address}>{this.state.address.city}</Text>
            </View>
            <View>
              <Text style={_styles.distance}>{this.state.distance}m</Text>
            </View>
          </View>

          <View style={{ aspectRatio: 1.4, marginVertical: 10, flexDirection: 'row' }}>
            <Map lat={this.state.latitude} long={this.state.longitude} markers={this.state.markers} />
          </View>
        </View>*/}
      </ScrollView>
    );
  }
}

Market.propTypes = {
  navigation: PropTypes.object
};

const _styles = StyleSheet.create({
  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginTop: 60,

    elevation: 3,
  },
  product: {
    display: 'flex',
    flexDirection: 'column',
    padding: 4,
  },
  notation: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    padding: 4,
    borderRadius: 16,
    backgroundColor: styles.colors.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  innerContainer: {
    alignItems: 'center',
  },
  back: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
    backgroundColor: 'transparent'
  },
  hero: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: styles.colors.primary,
    height: undefined,
    width: undefined,
    marginTop: -1
  },
  info: {
    position: 'absolute',
    bottom: -50,
    right: 8,
    left: 8,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 5,
    shadowColor: '#dadada',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    padding: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  rowIcon: {
    height: 64,
    width: 64,
  },
  rowInner: {
    paddingLeft: 8,
    flexGrow: 1
  },
  rowTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  rowRight: {
    marginTop: 4,
    marginRight: 4,
    width: 32,
    height: 24
  },
  rating: {
    borderRadius: 4,
    color: 'white',
    backgroundColor: styles.colors.primary,
  },
  overHeader: {
    backgroundColor: styles.colors.primary,
    height: 64,
    width: '100%'
  },
  overTitle: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 28,
    paddingLeft: 24,
    paddingRight: 24
  },
  overDesc: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: 'center'
  },
  container: {
    margin: 10,
    flex: 1,
    justifyContent: 'flex-start'
  },
  title: {
    color: styles.colors.primary,
    fontSize: 18,
    flexShrink: 1
  },
  address: {
    color: styles.colors.lightGray,
    fontSize: 14,
    flexShrink: 1
  },
  distance: {
    color: styles.colors.secondary,
    fontSize: 14,
    textAlign: 'right'
  }
});
