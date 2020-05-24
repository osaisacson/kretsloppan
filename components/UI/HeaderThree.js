import React from 'react';
import { Text, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const HeaderThree = (props) => {
  return <Text style={{ ...styles.headerThree, ...props.style }}>{props.text}</Text>;
};

const styles = StyleSheet.create({
  headerThree: { color: Colors.darkPrimary, fontFamily: 'roboto-light-italic' },
});

export default HeaderThree;
