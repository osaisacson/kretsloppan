import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentHeader = props => {
  return (
    <View>
      <View style={styles.contentHeaderContainer}>
        <Text style={styles.contentHeader}>{props.title}</Text>
        <Text style={styles.indicator}>({props.indicator})</Text>
      </View>
      <Text style={styles.subTitle}>{props.subTitle}</Text>
      {props.extraSubTitle ? (
        <Text style={styles.extraSubTitle}>{props.extraSubTitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentHeaderContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 20,
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
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 2
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 2
  }
});

export default ContentHeader;
