import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CachedImage from './CachedImage';
import TouchableCmp from './TouchableCmp';

const LargeImageItem = (props) => {
  return (
    <View style={styles.largeProject}>
      <View style={styles.largeTouchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.largeImageContainer}>
            <CachedImage style={styles.largeImage} uri={props.itemData.image} />
          </View>
        </TouchableCmp>
      </View>
      <Text style={styles.title}>{props.itemData.title} </Text>
      <Text style={styles.slogan}>{props.itemData.slogan} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  largeProject: {
    height: 230,
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
    height: 230,
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
