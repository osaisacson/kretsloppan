import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CachedImage from '../../components/UI/CachedImage';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProjectItem = ({ onSelect, itemData }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.product}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={itemData.image} />
            </View>
          </TouchableCmp>
        </View>
      </Card>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {itemData.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  product: {
    height: 250,
    width: '93%',
    margin: '1.5%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 15,
  },
  touchable: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden', //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },

  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    paddingLeft: 4,
    width: '90%',
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProjectItem;
