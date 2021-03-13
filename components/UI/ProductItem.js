import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { pure } from 'recompose';

import CachedImage from '../../components/UI/CachedImage';
import UserAvatar from '../../components/UI/UserAvatar';
import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProductItem = ({ navigation, itemData, showBackgroundText, isHorizontal, onSelect }) => {
  const {
    id,
    ownerId,
    location,
    image,
    priceText,
    price,
    background,
    amount,
    sold,
    title,
  } = itemData;

  const productOrders = useSelector((state) => state.orders.availableOrders);
  const ordersForProduct = productOrders.filter((order) => order.productId === id); //All orders for the product

  const allOrdersCollected = ordersForProduct.every((order) => order.isCollected);
  const cleanedUpSold = sold === undefined ? 0 : sold;
  const allSold = cleanedUpSold === amount && allOrdersCollected;

  const InfoBadge = ({ text, style }) => {
    return <Text style={{ ...styles.infoBadge, ...style }}>{text}</Text>;
  };

  return (
    <View style={styles.container}>
      <Card style={isHorizontal ? styles.horizontalProduct : styles.product}>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
            zIndex: 100,
          }}>
          <UserAvatar
            size={30}
            userId={ownerId}
            showBadge={false}
            actionOnPress={() => {
              navigation.navigate('Användare', {
                detailId: ownerId,
              });
            }}
          />
        </View>
        {allSold ? (
          <Text style={{ ...styles.status, backgroundColor: Colors.subtleGreen }}>Alla sålda</Text>
        ) : null}

        {location ? <InfoBadge text={location} style={styles.location} /> : null}

        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={image} />
            </View>
            {amount ? <InfoBadge text={`${amount} st à`} style={styles.amount} /> : null}
            {priceText && !price ? <InfoBadge text={priceText} style={styles.price} /> : null}
            {(price || price === 0) && !priceText ? (
              <InfoBadge text={`${price ? price : 0} kr`} style={styles.price} />
            ) : null}
            {price && priceText ? (
              <InfoBadge text={`${price}kr eller ${priceText}`} style={styles.price} />
            ) : null}
          </TouchableCmp>
        </View>
      </Card>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>

      {showBackgroundText ? (
        <Text numberOfLines={5} ellipsizeMode="tail" style={styles.backgroundText}>
          {background}
        </Text>
      ) : null}
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
    height: Styles.productItemHeight,
    width: '93%',
    margin: '1.5%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 15,
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
    width: 190,
    fontFamily: 'roboto-light-italic',
    fontSize: 15,
    paddingVertical: 5,
    marginLeft: 12,
  },
  backgroundText: {
    paddingLeft: 4,
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
    marginLeft: 15,
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
  infoBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
    fontFamily: 'roboto-light',
    fontSize: 13,
  },
  location: {
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  amount: {
    left: 0,
    bottom: 0,
    textAlign: 'right',
    marginRight: 8,
  },
  price: {
    fontFamily: 'roboto-bold',
    right: -9,
    bottom: 0,
    textAlign: 'right',
    marginRight: 8,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    position: 'absolute',
    left: 50,
    top: 80,
    zIndex: 100,
    fontFamily: 'roboto-light-italic',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
  },
});

export default pure(ProductItem);
