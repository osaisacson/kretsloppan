import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const SaferArea = ({ style, children }) => {
  return (
    <SafeAreaView
      style={{ ...styles.container, ...style }}
      forceInset={{ top: 'always', bottom: 'always' }}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SaferArea;
