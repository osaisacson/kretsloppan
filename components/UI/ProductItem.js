import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pure } from 'recompose';
import moment from 'moment/min/moment-with-locales';

import CachedImage from '../../components/UI/CachedImage';
import UserAvatar from '../../components/UI/UserAvatar';
import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProductItem = ({ navigation, itemData, isHorizontal, onSelect }) => {
  const {
    ownerId,
    location,
    image,
    priceText,
    price,
    background,
    amount,
    sold,
    booked,
    title,
    date,
  } = itemData;

  const originalItems = amount === undefined ? 1 : amount;
  const bookedItems = booked || 0;
  const soldItems = sold || 0;

  const allSold = originalItems === soldItems;
  const allReserved = originalItems === bookedItems;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          zIndex: 100,
        }}>
        <UserAvatar
          size={40}
          userId={ownerId}
          actionOnPress={() => {
            navigation.navigate('Användare', {
              detailId: ownerId,
            });
          }}
        />
        <View style={styles.locationAndDate}>
          {location ? <Text style={styles.cursiveAndRight}>{location}</Text> : null}
          {date ? (
            <Text
              style={{
                ...styles.cursiveAndRight,
                fontSize: 12,
              }}>
              {moment(date).locale('sv').format('D MMMM HH:mm')}
            </Text>
          ) : null}
        </View>
      </View>

      <Card style={isHorizontal ? styles.horizontalProduct : styles.product}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View style={styles.overlayBadge}>
              <Text
                style={{
                  ...styles.status,
                  backgroundColor: allSold
                    ? Colors.subtleGreen
                    : allReserved
                    ? Colors.darkPrimary
                    : '#fff',
                  color: allSold || allReserved ? '#fff' : '#000',
                }}>
                {allSold || allReserved
                  ? allSold
                    ? 'Alla sålda'
                    : 'Alla reserverade'
                  : `${originalItems - bookedItems} st kvar`}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={image} />
            </View>
          </TouchableCmp>
        </View>

        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>

        {background ? (
          <Text numberOfLines={5} ellipsizeMode="tail">
            {background}
          </Text>
        ) : null}

        {(price || price === 0) && !priceText ? (
          <Text style={styles.price}>
            {`${price ? price : 0} kr `}
            {originalItems > 1 ? 'styck' : null}
          </Text>
        ) : null}
        {price && priceText ? (
          <Text style={styles.price}>{`${price}kr eller ${priceText}`}</Text>
        ) : null}
        {priceText && !price ? <Text style={styles.price}>{priceText}</Text> : null}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
    marginBottom: 100,
  },
  product: {
    height: Styles.productItemHeight,
    width: '97%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 5,
  },
  horizontalProduct: {
    height: Styles.productItemHeight,
    width: 200,
    marginLeft: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
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
    marginTop: 5,
    fontFamily: 'roboto-bold',
    fontSize: 17,
  },
  locationAndDate: {
    flex: 1,
    marginRight: 10,
    marginTop: 10,
  },
  cursiveAndRight: {
    fontFamily: 'roboto-light-italic',
    textAlign: 'right',
  },
  price: {
    marginTop: 8,
    fontFamily: 'roboto-bold',
  },
  overlayBadge: {
    position: 'absolute',
    borderRadius: Styles.borderRadius,
    zIndex: 100,
  },
  status: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 14,
  },
});

export default pure(ProductItem);
