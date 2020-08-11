import { Ionicons } from '@expo/vector-icons';
import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import CachedImage from '../../components/UI/CachedImage';
import UserAvatar from '../../components/UI/UserAvatar';
import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProductItem = ({
  navigation,
  itemData,
  showBackgroundText,
  isHorizontal,
  showSmallStatusIcons,
  onSelect,
}) => {
  const isReserved = itemData.status === 'reserverad';
  const isOrganised = itemData.status === 'ordnad';
  const isPickedUp = itemData.status === 'hämtad';

  let icon;
  let bgColor;

  if (isReserved) {
    icon = 'bookmark';
    bgColor = Colors.primary;
  }

  if (isOrganised) {
    icon = 'star';
    bgColor = Colors.subtleGreen;
  }

  if (isPickedUp) {
    icon = 'checkmark';
    bgColor = Colors.completed;
  }

  const relevantDate = itemData.collectedDate
    ? `Hämtad ${Moment(itemData.collectedDate).locale('sv').format('D MMMM YYYY')}`
    : itemData.organisedDate
    ? `Hämtas ${Moment(itemData.organisedDate).locale('sv').format('D MMMM YYYY')}`
    : itemData.reservedDate
    ? `Reserverad till ${Moment(itemData.reservedDate).locale('sv').format('D MMMM YYYY')}`
    : 'Inget relevant datum';

  return (
    <View style={styles.container}>
      {showBackgroundText ? (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.date}>
          {relevantDate}
        </Text>
      ) : null}
      <Card style={isHorizontal ? styles.horizontalProduct : styles.product}>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
            zIndex: 100,
          }}>
          <UserAvatar
            size={30}
            userId={itemData.ownerId}
            showBadge={false}
            actionOnPress={() => {
              navigation.navigate('Användare', {
                detailId: itemData.ownerId,
              });
            }}
          />
        </View>
        {itemData.location ? <Text style={styles.location}>{itemData.location}</Text> : null}
        {showSmallStatusIcons ? (
          <Ionicons
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              textAlign: 'center',
              zIndex: 100,
              backgroundColor: bgColor,
              color: '#fff',
              width: 30,
            }}
            name={icon ? (Platform.OS === 'android' ? `md-${icon}` : `ios-${icon}`) : null}
            size={23}
          />
        ) : null}

        <View style={styles.touchable}>
          <TouchableCmp onPress={onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={itemData.image} />
            </View>
            {itemData.priceText && !itemData.price ? (
              <Text style={styles.price}>{itemData.priceText}</Text>
            ) : null}

            {itemData.price && !itemData.priceText ? (
              <Text style={styles.price}>{itemData.price ? itemData.price : 0} kr</Text>
            ) : null}
          </TouchableCmp>
        </View>
      </Card>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {itemData.title}
      </Text>

      {showBackgroundText ? (
        <Text numberOfLines={5} ellipsizeMode="tail" style={styles.backgroundText}>
          {itemData.background}
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
  statusBadge: {
    marginLeft: 12,
    fontSize: 13,
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
  icon: {
    position: 'absolute',
    padding: 5,
    zIndex: 99,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2, //Because shadow only work on iOS, elevation is same thing but for android.
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    color: '#000',
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

export default ProductItem;
