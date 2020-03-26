import React from 'react';

import { Image, View, Text, TouchableOpacity } from 'react-native';

import styles from '../styles';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={_styles.btn}>
        <Text style={_styles.btnInner(this.props.color)}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}


const _styles = {
  btn: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnInner: color => {
    iColor = 'white'
    if (color === 'white') {
      iColor = 'black'
    }
    return {
      backgroundColor: color,
      color: iColor,
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      padding: 16
    }
  },
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
