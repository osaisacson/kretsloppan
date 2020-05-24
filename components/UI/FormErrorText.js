import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//Constants
import Colors from './../../constants/Colors';

const FormErrorText = (props) => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{props.errorText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: Colors.primary,
    fontFamily: 'roboto-regular',
    fontSize: 13,
    textAlign: 'right',
  },
});

export default FormErrorText;
