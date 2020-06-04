import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import TouchableCmp from './TouchableCmp';

const PickerItem = (props) => {
  return (
    <View style={styles.item}>
      <View
        style={{
          ...styles.touchable,
          backgroundColor: props.color,
          height: props.isSelected ? 45 : 35,
        }}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: props.isSelected ? 'bebas-neue' : 'bebas-neue-light',
                color: '#000',
              }}>
              {props.title}
            </Text>
          </View>
        </TouchableCmp>
      </View>
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
  item: {
    minWidth: 100,
    marginLeft: 14,
  },
  touchable: {
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  textContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    paddingTop: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  details: {
    color: '#000',
  },
});

export default PickerItem;
