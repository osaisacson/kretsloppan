import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const HeaderThree = (props) => {
  return (
    <Text style={{ ...styles.headerThree, ...props.style }}>{props.text}</Text>
  );
};

const styles = StyleSheet.create({
  headerThree: { fontFamily: 'roboto-light-italic', color: Colors.darkPrimary },
});

export default HeaderThree;
