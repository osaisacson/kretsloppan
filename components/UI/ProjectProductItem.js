import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pure } from 'recompose';

import Styles from '../../constants/Styles';
import CachedImage from './CachedImage';
import Card from './Card';
import TouchableCmp from './TouchableCmp';
import UserAvatarWithBadge from './../UI/UserAvatarWithBadge';

const ProjectProductItem = ({ navigation, productInProject, onSelect }) => {
  const { sellerId, image, quantity, background, title, location } = productInProject;

  return (
    <View style={styles.container}>
      <Card style={styles.product}>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
            zIndex: 100,
          }}>
          <UserAvatarWithBadge
            size={60}
            navigation={navigation}
            text={'säljare'}
            detailId={sellerId}
          />
        </View>
        {location ? <Text style={styles.location}>{location}</Text> : null}

        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={image} />
            </View>
            {quantity ? <Text style={styles.amount}>{quantity} st</Text> : null}
          </TouchableCmp>
        </View>
      </Card>

      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
      <Text numberOfLines={5} ellipsizeMode="tail" style={styles.backgroundText}>
        {background}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  product: {
    height: Styles.largeProductItemHeight,
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
    paddingTop: 18,
    paddingLeft: 4,
    width: 200,
    fontFamily: 'roboto-bold',
    fontSize: 17,
    marginHorizontal: 10,
  },
  backgroundText: {
    paddingLeft: 4,
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  date: {
    width: '100%',
    textAlign: 'right',
    marginBottom: -10,
    paddingRight: 25,
    marginTop: 10,
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
  },
  location: {
    padding: 5,
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontFamily: 'roboto-bold',
    fontSize: 15,
    textAlign: 'right',
  },
  amount: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 5,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontFamily: 'roboto-bold',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 8,
  },
  price: {
    position: 'absolute',
    right: -9,
    bottom: 0,
    padding: 5,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontFamily: 'roboto-bold',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 8,
  },
});

export default pure(ProjectProductItem);
