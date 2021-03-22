import React from 'react';
import { Text, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const HeaderThree = ({ style, text }) => {
  return <Text style={{ ...styles.headerThree, ...style }}>{text}</Text>;
};

const styles = StyleSheet.create({
  headerThree: { fontFamily: 'roboto-light-italic', color: Colors.darkPrimary, padding: 5 },
});

export default HeaderThree;
