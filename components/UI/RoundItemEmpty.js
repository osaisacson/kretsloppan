import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';
import TouchableCmp from './TouchableCmp';

const RoundItemEmpty = ({ isSelected, onSelect, title }) => {
  return (
    <View style={styles.project}>
      <View style={isSelected ? styles.selectedTouchable : styles.touchable}>
        <TouchableCmp onPress={onSelect} useForeground>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title} </Text>
          </View>
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    color: Colors.darkPrimary,
    fontFamily: 'roboto-bold-italic',
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'center',
  },
  project: {
    height: 80,
    width: 80,
    marginLeft: 10,
    marginRight: 15,
    borderRadius: 100 / 2,
  },
  touchable: {
    height: 80,
    width: 80,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 0.1,
    borderColor: '#000',
  },
  selectedTouchable: {
    height: 80,
    width: 80,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  textContainer: {
    textAlign: 'center',
    marginTop: 25,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
  },
});

export default RoundItemEmpty;
