import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Styles from './../../constants/Styles';
import CachedImage from './CachedImage';
import TouchableCmp from './TouchableCmp';

const LargeImageItem = ({ onSelect, itemData }) => {
  return (
    <View style={styles.largeProject}>
      <View style={styles.largeTouchable}>
        <TouchableCmp onPress={onSelect} useForeground>
          <View style={styles.largeImageContainer}>
            <CachedImage style={styles.largeImage} uri={itemData.image} />
          </View>
        </TouchableCmp>
      </View>
      <Text style={styles.title}>{itemData.title} </Text>
      <Text style={styles.slogan}>{itemData.slogan} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  largeProject: {
    height: Styles.largeImageItemHeight,
    width: 350,
    marginLeft: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#ddd',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeTouchable: {
    height: Styles.largeImageItemHeight,
    width: 350,
    borderRadius: 5,
    overflow: 'hidden',
  },
  largeImageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 5,
    overflow: 'hidden', //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  largeImage: {
    borderRadius: 5,
    width: '100%',
    height: '100%',
  },
  slogan: {
    fontFamily: 'roboto-light-italic',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default LargeImageItem;
