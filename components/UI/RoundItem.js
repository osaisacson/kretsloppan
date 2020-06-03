import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CachedImage from '../../components/UI/CachedImage';
import Colors from '../../constants/Colors';
import TouchableCmp from './TouchableCmp';

const RoundItem = (props) => {
  return (
    <View style={styles.project}>
      <View style={props.isSelected ? styles.selectedTouchable : styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.imageContainer}>
            <CachedImage style={styles.image} uri={props.itemData.image} />
          </View>
        </TouchableCmp>
      </View>
      <Text style={styles.title}>{props.itemData.title} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    fontFamily: 'roboto-bold-italic',
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'center',
  },
  project: {
    height: 100,
    width: 100,
    marginLeft: 10,
    marginRight: 15,
    borderRadius: 100 / 2,
  },
  touchable: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 0.1,
    borderColor: '#000',
  },
  selectedTouchable: {
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
  },
});

export default RoundItem;
