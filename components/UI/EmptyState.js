import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyState = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Text style={styles.text}>
        {props.text}
        {props.children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  text: {
    color: '#b0b0b0',
    textAlign: 'center',
  },
});

export default EmptyState;
