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
  indicator,
  simpleCount,
  showAddLink,
  showMoreLink,
  showNotificationBadge,
  isSearch,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textAndBadge}>
        <View>{icon ? icon : null}</View>
        <Text style={styles.contentHeader}>{title}</Text>
        {simpleCount ? (
          <Text style={styles.results}>
            {isSearch ? `${simpleCount} Hittade` : `(${simpleCount})`}
          </Text>
        ) : null}
        {showNotificationBadge ? (
          <Badge size={25} style={{ fontWeight: 'bold', marginBottom: 6 }}>
            {indicator}
          </Badge>
        ) : null}
      </View>

      <View style={styles.rightHandButtons}>
        {showMoreLink ? <ButtonSeeMore onSelect={showMoreLink} /> : null}
        {showAddLink ? (
          <ButtonIcon icon="plus" compact onSelect={showAddLink} color={Colors.darkPrimary} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 5,
    width: '100%',
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
  results: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 28,
  },
  rightHandButtons: {
    flexDirection: 'row',
  },
});

export default pure(HeaderTwo);
