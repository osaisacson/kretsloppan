import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { pure } from 'recompose';

import ResolvedBadge from '../../components/UI/ResolvedBadge';
import Colors from '../../constants/Colors';
import Styles from './../../constants/Styles';
import TouchableCmp from './TouchableCmp';

const TextItem = ({ itemData, onSelect }) => {
  const resolvedBadge = useMemo(
    () =>
      itemData.status === 'löst' ? (
        <ResolvedBadge badgeText="Löst!" />
      ) : (
        <View style={styles.spacer} />
      ),
    [itemData.status]
  );

  return (
    <Card style={{ height: Styles.textItemHeight }}>
      <View style={styles.container}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <>
              {resolvedBadge}
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                {itemData.title}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
                {itemData.description}
              </Text>
            </>
          </TouchableCmp>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 15,
  },
  touchable: {
    overflow: 'hidden',
    marginRight: 25,
    flex: 1,
    justifyContent: 'center',
    padding: 15,
  },
  title: {
    color: Colors.primary,
    width: 300,
    fontFamily: 'roboto-bold',
    fontSize: 18,
    marginLeft: 4,
  },
  subTitle: {
    color: Colors.primary,
    paddingBottom: 25,
    width: 300,
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 4,
  },
});

export default pure(TextItem);
