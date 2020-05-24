import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';

const HeaderOne = (props) => {
  return (
    <View>
      <View style={styles.contentHeaderContainer}>
        <Text style={styles.contentHeader}>{props.title}</Text>
        {props.showNotificationBadge ? (
          <Badge style={{ marginBottom: 5, fontWeight: 'bold' }}>{props.indicator}</Badge>
        ) : null}
      </View>
      <Text style={styles.subTitle}>{props.subTitle}</Text>
      {props.extraSubTitle ? <Text style={styles.extraSubTitle}>{props.extraSubTitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
    marginRight: 6,
  },
  contentHeaderContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 20,
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
    paddingBottom: 2,
    paddingLeft: 15,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    paddingBottom: 2,
    paddingLeft: 15,
  },
});

export default HeaderOne;
