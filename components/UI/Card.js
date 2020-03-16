import React from 'react';
import { View, StyleSheet } from 'react-native';
import Styles from '../../constants/Styles';

const Card = props => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2, //Because shadow only work on iOS, elevation is same thing but for android.
    borderRadius: Styles.borderRadius,
    backgroundColor: 'rgba(255,255,255,0.7)'
  }
});

export default Card;
