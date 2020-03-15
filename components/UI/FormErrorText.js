import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//Constants
import Colors from './../../constants/Colors';

const FormErrorText = () => {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'roboto-regular',
    color: Colors.primary,
    fontSize: 13
  }
});

export default FormErrorText;
