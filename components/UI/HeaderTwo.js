import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Badge } from 'react-native-paper';
import { pure } from 'recompose';

import Colors from './../../constants/Colors';
import ButtonIcon from './ButtonIcon';
import ButtonSeeMore from './ButtonSeeMore';

const HeaderTwo = ({
  icon,
  title,
  subTitle,
  extraSubTitle,
  indicator,
  simpleCount,
  showAddLink,
  showMoreLink,
  showNotificationBadge,
  isSearch,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textSection}>
        <View style={styles.textAndBadge}>
          {icon ? icon : null}
          <Text style={styles.contentHeader}>{title}</Text>
          {simpleCount ? (
            <Text style={isSearch ? styles.simpleCountForSearch : styles.simpleCount}>
              {isSearch ? `${simpleCount} Hittade` : `(${simpleCount})`}
            </Text>
          ) : null}
          {showNotificationBadge ? (
            <Badge style={{ fontWeight: 'bold', marginBottom: 5 }}>{indicator}</Badge>
          ) : null}
        </View>
        {subTitle ? <Text style={styles.subTitle}>{subTitle}</Text> : null}
        {extraSubTitle ? <Text style={styles.extraSubTitle}>{extraSubTitle}</Text> : null}
      </View>
      <View style={styles.indicatorSection}>
        <View
          style={{ flexDirection: 'row', alignSelf: 'flex-end', paddingBottom: subTitle ? 20 : 0 }}>
          {showMoreLink ? <ButtonSeeMore onSelect={showMoreLink} /> : null}
          {showAddLink ? (
            <ButtonIcon icon="plus" compact onSelect={showAddLink} color={Colors.darkPrimary} />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 15,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textSection: {
    textAlignVertical: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    flexGrow: 3,
  },
  indicatorSection: {
    flexGrow: 1,
    marginRight: 5,
  },
  textAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 31,
    marginRight: 6,
  },
  simpleCount: {
    fontFamily: 'roboto-light',
    fontSize: 15,
    marginBottom: 6,
  },
  simpleCountForSearch: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
  },
  indicator: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
    paddingBottom: 2,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
  },
});

export default pure(HeaderTwo);
