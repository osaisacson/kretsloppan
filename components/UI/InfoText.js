import React from 'react';
import { Text, StyleSheet } from 'react-native';

const InfoText = (props) => {
  return (
    <Text
      style={
        props.isBold
          ? { ...styles.infoText, ...styles.infoTextEmphasis }
          : { ...styles.infoText, ...props.style }
      }>
      {props.text}
    </Text>
  );
};

const styles = StyleSheet.create({
  infoText: { fontFamily: 'roboto-light-italic', textAlign: 'center' },
  infoTextEmphasis: { fontFamily: 'roboto-bold-italic' },
});

export default InfoText;
