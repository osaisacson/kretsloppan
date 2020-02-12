import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentHeader = props => {
  return (
    <View style={styles.contentHeaderContainer}>
      <Text style={styles.contentHeader}>{props.title}</Text>
      <Text style={styles.indicator}>({props.indicator})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  contentHeaderContainer: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'baseline'
  },
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
    marginRight: 6
  },
  indicator: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
    paddingBottom: 2
  }
});

export default ContentHeader;
