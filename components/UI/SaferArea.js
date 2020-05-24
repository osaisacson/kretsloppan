import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const SaferArea = (props) => {
  return (
    <SafeAreaView
      forceInset={{ top: 'always', bottom: 'always' }}
      style={{ ...styles.container, ...props.style }}>
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SaferArea;
