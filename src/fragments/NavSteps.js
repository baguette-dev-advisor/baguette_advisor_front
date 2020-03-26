import React from 'react';
import PropTypes from 'prop-types';

import { View, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from '../styles';

import {pad} from '../utils';
import Button from './Button';

export default class NavSteps extends React.Component {
  constructor(props) {
    super(props);

    this.dots = [];
    for(var i = 0; i<this.props.steps; i +=1) {
      this.dots.push(<Icon style={_styles.progressDot} name='lens' size={18} color={this.props.step === i ? 'black' : 'lightgrey'} key={i} />);
    }

    const length = Math.max(this.props.left.length, this.props.right.length);
    this.left = pad(this.props.left, length, ' ', true);
    this.right = pad(this.props.right, length, ' ', false);
  }

  render() {
    return (
      <View style={_styles.bottomNav}>
        <Button title={this.left} color={this.props.leftColor} onPress={this.props.onLeftPress} />

        <View style={_styles.progress}>
          {this.dots}
        </View>

        <Button title={this.right} color={this.props.rightColor} onPress={this.props.onRightPress} />
      </View>
    );
  }
}

NavSteps.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
  color: PropTypes.string,
  step: PropTypes.number,
  steps: PropTypes.number,
  onLeftPress: PropTypes.func,
  onRightPress: PropTypes.func,
};

const _styles = {
  bottomNav: {
    flexDirection: 'row',
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  progressDot: {
    marginLeft: 16,
    marginRight: 16
  }
};
