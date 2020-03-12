import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const SaferArea = props => {
  return (
    <SafeAreaView
      style={{ ...styles.container, ...props.style }}
      forceInset={{ top: 'always', bottom: 'always' }}
    >
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SaferArea;
