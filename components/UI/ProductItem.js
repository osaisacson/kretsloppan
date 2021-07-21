import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pure } from 'recompose';

import CachedImage from '../../components/UI/CachedImage';
import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProductItem = ({ itemData, onSelect, productHeight, hideInfo }) => {
  const { image, priceText, price, background, amount, sold, booked, title } = itemData;

  const originalItems = amount === undefined ? 1 : amount;
  const bookedItems = booked || 0;
  const soldItems = sold || 0;

  const allSold = originalItems === soldItems;
  const allReserved = originalItems === bookedItems;

  return (
    <Card
      style={{
        ...styles.productCard,
        height: productHeight,
      }}>
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

      {!hideInfo ? (
        <>
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
        </>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 5,
  },
  // horizontalProduct: {
  //   height: Styles.smallProductItemHeight,
  //   width: 250,
  //   borderWidth: 0.5,
  //   borderColor: '#ddd',
  // },
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
