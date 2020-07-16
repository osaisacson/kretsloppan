import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';

const HeaderOne = ({ title, showNotificationBadge, indicator, subTitle, extraSubTitle }) => {
  return (
    <View>
      <View style={styles.contentHeaderContainer}>
        <Text style={styles.contentHeader}>{title}</Text>
        {showNotificationBadge ? (
          <Badge style={{ marginBottom: 5, fontWeight: 'bold' }}>{indicator}</Badge>
        ) : null}
      </View>
      <Text style={styles.subTitle}>{subTitle}</Text>
      {extraSubTitle ? <Text style={styles.extraSubTitle}>{extraSubTitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contentHeaderContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 20,
    alignItems: 'baseline',
  },
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
    marginRight: 6,
  },
  indicator: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
    paddingBottom: 2,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 2,
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 2,
  },
});

export default HeaderOne;
