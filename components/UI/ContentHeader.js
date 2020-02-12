import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentHeader = props => {
  return (
    <View styles={styles.contentHeaderContainer}>
      <Text style={styles.contentHeader}>{props.title}</Text>
      <Text style={styles.indicator}>({props.indicator})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  contentHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 20
  },
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25
  },
  indicator: {
    fontFamily: 'roboto-regular',
    fontSize: 16
  }
});

export default ContentHeader;
