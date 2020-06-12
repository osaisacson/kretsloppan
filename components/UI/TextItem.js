import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

import ResolvedBadge from '../../components/UI/ResolvedBadge';
import Colors from '../../constants/Colors';
import Styles from './../../constants/Styles';
import TouchableCmp from './TouchableCmp';

const TextItem = (props) => {
  const resolvedBadge = useMemo(
    () =>
      props.itemData.status === 'löst' ? (
        <ResolvedBadge badgeText="Löst!" />
      ) : (
        <View style={styles.spacer} />
      ),
    [props.itemData.status]
  );

  return (
    <Card style={{ height: Styles.textItemHeight }}>
      <View style={styles.container}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <>
              {resolvedBadge}
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                {props.itemData.title}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail" style={styles.subTitle}>
                {props.itemData.description}
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

export default TextItem;
