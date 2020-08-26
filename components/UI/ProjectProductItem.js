import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CachedImage from './CachedImage';
import UserAvatar from './UserAvatar';
import Styles from '../../constants/Styles';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProjectProductItem = ({
  navigation,
  itemData,
  showBackgroundText,
  isHorizontal,
  showSmallStatusIcons,
  onSelect,
}) => {
  const { ownerId, location, image, priceText, price, background, amount, title } = itemData;

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
        {location ? <Text style={styles.location}>{location}</Text> : null}

        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={image} />
            </View>
            {amount ? <Text style={styles.amount}>{amount} st à</Text> : null}
            {priceText && !price ? <Text style={styles.price}>{priceText}</Text> : null}
            {(price || price === 0) && !priceText ? (
              <Text style={styles.price}>{price ? price : 0} kr</Text>
            ) : null}
            {price && priceText ? (
              <Text style={styles.price}>
                {price}kr eller {priceText}
              </Text>
            ) : null}
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
    paddingLeft: 4,
    width: 200,
    fontFamily: 'roboto-regular',
    fontSize: 16,
    marginLeft: 15,
  },
  backgroundText: {
    paddingLeft: 4,
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
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

export default ProjectProductItem;
