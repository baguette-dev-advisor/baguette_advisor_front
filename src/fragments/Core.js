import React, { Component } from 'react';
import { Text } from 'react-native';

import styles from '../styles/index';

export default ({ match }) => (
  <Text style={styles.home.topic}>
    {match.params.topicId}
  </Text>
)

