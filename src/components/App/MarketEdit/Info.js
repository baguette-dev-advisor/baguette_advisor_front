import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, Image, StyleSheet, TextInput, StatusBar, ScrollView, Platform, PermissionsAndroid} from 'react-native';
import { Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ProgressBar from 'react-native-progress/Bar';

import styles from '../../../styles';
import NavSteps from './../../../fragments/NavSteps';

import log from '../../../providers/log';
import {popAlert} from '../../../utils';
import I18n from '../../../i18n/i18n';

const { width } = Dimensions.get('window');

export default class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      products: {}
    };

    this.onLeftPress = this.onLeftPress.bind(this);
    this.onRightPress = this.onRightPress.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.ratingCompleted = this.ratingCompleted.bind(this);
  }

  onLeftPress() {
    this.props.navigation.goBack();
  }

  onRightPress() {
    if (!this.state.name) {
      return popAlert(I18n.t('errors.information.missing'), I18n.t('new.noName') + '.');
    }

    this.props.navigation.navigate('Map', {
      ...this.props.navigation.state.params,
      name: this.state.name,
      products: this.state.products,
    });
  }

  onNameChange(name) {
    this.setState({
      name
    });
  }

  ratingCompleted(product, good) {
    return () => {
      this.setState({
        products: {
          ...this.state.products,
          [product]: good ? 1 : -1
        }
      });
    };
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
            <Text style={_styles.boxTitle}>{I18n.t('new.nameQuestion')}</Text>
            <View style={_styles.inputRow}>
              <TextInput
                placeholder={I18n.t('new.name')}
                placeholderTextColor='#DDD'
                selectionColor={styles.colors.primary}
                style={_styles.input}
                underlineColorAndroid="transparent"
                onChangeText={this.onNameChange}
                value={this.state.name}
                autoCorrect={false}
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
              />
              <Icon name='create' color='black' />
            </View>
          </View>

          <ScrollView style={{width: '100%'}}>
            <View style={_styles.item}>
              <Image source={require('../../../assets/baguette_img.png')} style={_styles.itemIcon} />
              <View style={_styles.itemInner}>
                <Text style={_styles.rowTitle}>{I18n.t('products.baguette')}</Text>
                <View style={_styles.itemRatings}>
                  <Icon
                    name='thumb-down'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.baguette == -1}
                    onPress={this.ratingCompleted('baguette', false)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                  <Icon
                    name='thumb-up'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.baguette == 1}
                    onPress={this.ratingCompleted('baguette', true)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                </View>
              </View>
            </View>

            <View style={_styles.item}>
              <Image source={require('../../../assets/croissant_img.png')} style={_styles.itemIcon} />
              <View style={_styles.itemInner}>
                <Text style={_styles.rowTitle}>{I18n.t('products.croissant')}</Text>
                <View style={_styles.itemRatings}>
                  <Icon
                    name='thumb-down'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.croissant == -1}
                    onPress={this.ratingCompleted('croissant', false)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                  <Icon
                    name='thumb-up'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.croissant == 1}
                    onPress={this.ratingCompleted('croissant', true)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                </View>
              </View>
            </View>

            <View style={_styles.item}>
              <Image source={require('../../../assets/pain_choco_img.png')} style={_styles.itemIcon} />
              <View style={_styles.itemInner}>
                <Text style={_styles.rowTitle}>{I18n.t('products.pain_choco')}</Text>
                <View style={_styles.itemRatings}>
                  <Icon
                    name='thumb-down'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.pain_choco == -1}
                    onPress={this.ratingCompleted('pain_choco', false)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                  <Icon
                    name='thumb-up'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.pain_choco == 1}
                    onPress={this.ratingCompleted('pain_choco', true)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                </View>
              </View>
            </View>

            <View style={_styles.item}>
              <Image source={require('../../../assets/pain_bio_img.png')} style={_styles.itemIcon} />
              <View style={_styles.itemInner}>
                <Text style={_styles.rowTitle}>{I18n.t('products.pain_bio')}</Text>
                <View style={_styles.itemRatings}>
                  <Icon
                    name='thumb-down'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.pain_bio == -1}
                    onPress={this.ratingCompleted('pain_bio', false)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                  <Icon
                    name='thumb-up'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.pain_bio == 1}
                    onPress={this.ratingCompleted('pain_bio', true)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                </View>
              </View>
            </View>

            <View style={_styles.item}>
              <Image source={require('../../../assets/sandwich_img.png')} style={_styles.itemIcon} />
              <View style={_styles.itemInner}>
                <Text style={_styles.rowTitle}>{I18n.t('products.sandwich')}</Text>
                <View style={_styles.itemRatings}>
                  <Icon
                    name='thumb-down'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.sandwich == -1}
                    onPress={this.ratingCompleted('sandwich', false)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                  <Icon
                    name='thumb-up'
                    size={16}
                    color={styles.colors.primary}
                    raised
                    reverse={this.state.products.sandwich == 1}
                    onPress={this.ratingCompleted('sandwich', true)}
                    containerStyle={{'borderRadius': 5, margin: -1}}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>



        <NavSteps
          left={I18n.t('generics.goBack')} 
          onLeftPress={this.onLeftPress} 
          leftColor='white' 
          step={2} 
          steps={4} 
          right={I18n.t('generics.next')} 
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
  box: {
    backgroundColor: 'white',
    borderRadius: 6,
    width: '100%',
    paddingBottom: 32,
    paddingTop: 32,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 16
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
  title: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    flexShrink: 1,
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center'
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
    flex: 1,
    color: '#313131',
  },
  ratings: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 16,
    display: 'flex',
    flexDirection: 'row'
  },
  rateDesc: {
    color: 'black',
    fontSize: 18,
    marginLeft: 8,
    paddingBottom: 8,
    marginTop: 24,
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

  item: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    marginBottom: 16
  },
  itemIcon: {
    height: 64,
    width: 64,
  },
  itemInner: {
    paddingLeft: 8,
    flexGrow: 1
  },
  rowTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemRatings: {
    marginLeft: 8,
    marginRight: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
