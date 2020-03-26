import React from 'react';

import { Image, View, Text, TouchableHighlight } from 'react-native';

import styles from '../styles';

export default class DrawerItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onItemPress({route: {key: this.props.key2, routeName: this.props.key2}, focused: this.props.key2 === this.props.navigation.state.routeName})}>
        <View style={_styles.drawerItemStyle(this.props.key2 === this.props.navigation.state.routeName)}>
          <Image source={this.props.icon} style={_styles.drawerIconStyle} />
          <Text style={_styles.drawerLabelStyle}>{this.props.label}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}


const _styles = {
  drawerItemStyle: active => {
    let s = {
      display: 'flex', 
      flexDirection:'row', 
      height: 62, 
      overflow: 'visible',
      position: 'relative',
      alignItems: 'center',
      backgroundColor: 'white', 
      shadowColor: '#000',
      marginTop: 8,
      marginBottom: 8
    }
    if (active) {
      return {
        ...s,
        borderStyle: 'solid',
        borderColor: styles.colors.primary,
        borderRightWidth: 5,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }
    }
    return s
  },
  drawerIconStyle: {
    height: 32, 
    width: 48, 
    marginRight: 18, 
    marginLeft: 16, 
    shadowColor: '#ccc',
    overflow: 'visible',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5
  },
	drawerLabelStyle: {
		fontSize: 16,
    color: 'black',
    fontWeight: '600',
    color: '#323232'
	}
};
