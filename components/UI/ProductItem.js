import { Ionicons } from '@expo/vector-icons';
import moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSelector } from 'react-redux';

import CachedImage from '../../components/UI/CachedImage';
import StatusBadge from '../../components/UI/StatusBadge';
import Colors from './../../constants/Colors';
import Card from './Card';
import TouchableCmp from './TouchableCmp';

const ProductItem = (props) => {
  const loggedInUserId = useSelector((state) => state.auth.userId);

  const viewerIsSeller = loggedInUserId === props.itemData.ownerId;
  const viewerIsBuyer =
    loggedInUserId === (props.itemData.reservedUserId || props.itemData.collectingUserId);

  const youHaveNotAgreed = viewerIsBuyer
    ? !props.itemData.buyerAgreed
    : viewerIsSeller
    ? !props.itemData.sellerAgreed
    : null;

  const waitingForYou = (viewerIsBuyer && youHaveNotAgreed) || (viewerIsSeller && youHaveNotAgreed);

  const isReserved = props.itemData.status === 'reserverad';
  const isOrganised = props.itemData.status === 'ordnad';
  const isPickedUp = props.itemData.status === 'hämtad';

  let icon;
  let bgColor;
  let textColor;
  let userBadgeIcon;
  let badgeText;
  let noCorners;

  if (isReserved) {
    icon = 'bookmark';
    bgColor = Colors.lightPrimary;
    textColor = '#000';
    userBadgeIcon = 'return-left';
    noCorners = true;
    badgeText = `Går ut ${moment(props.itemData.reservedUntil)
      .locale('sv')
      .endOf('day')
      .fromNow()}`;
  }

  if (isOrganised) {
    icon = 'star';
    bgColor = Colors.subtleGreen;
    userBadgeIcon = 'clock';
    badgeText = moment(props.itemData.collectingDate).locale('sv').calendar();
  }

  if (isPickedUp) {
    icon = 'checkmark';
    bgColor = Colors.completed;
    userBadgeIcon = 'checkmark';
    badgeText = `Ordnat ${moment(props.itemData.collectedDate).locale('sv').calendar()}`;
  }

  return (
    <View style={styles.container}>
      <Card style={props.isHorizontal ? styles.horizontalProduct : styles.product}>
        {props.isSearchView ? (
          <Ionicons
            style={{
              position: 'absolute',
              alignSelf: 'flex-start',
              textAlign: 'center',
              zIndex: 100,
              backgroundColor: bgColor,
              color: '#fff',
              width: 30,
            }}
            name={icon ? (Platform.OS === 'android' ? `md-${icon}` : `ios-${icon}`) : null}
            size={23}
          />
        ) : (
          <>
            <StatusBadge
              noCorners={noCorners}
              style={styles.statusBadge}
              text={badgeText}
              icon={
                userBadgeIcon
                  ? Platform.OS === 'android'
                    ? `md-${userBadgeIcon}`
                    : `ios-${userBadgeIcon}`
                  : null
              }
              backgroundColor={bgColor}
              textColor={textColor}
            />
            {isReserved ? (
              <StatusBadge
                style={{
                  padding: 0,
                  top: 20,
                  position: 'absolute',
                  zIndex: 100,
                  width: '100%',
                }}
                text={
                  !props.itemData.suggestedDate
                    ? 'Ange tidsförslag'
                    : waitingForYou
                    ? 'Väntar på ditt godkännande'
                    : 'Väntar på motpart'
                }
                icon={Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'}
                backgroundColor={
                  !props.itemData.suggestedDate
                    ? Colors.darkPrimary
                    : waitingForYou
                    ? Colors.darkPrimary
                    : Colors.subtleBlue
                }
              />
            ) : null}
          </>
        )}

        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={props.itemData.image} />
            </View>
            {props.itemData.priceText ? (
              <Text style={styles.price}>{props.itemData.priceText}</Text>
            ) : null}

            {props.itemData.price ? (
              <Text style={styles.price}>{props.itemData.price ? props.itemData.price : 0} kr</Text>
            ) : null}
          </TouchableCmp>
        </View>
      </Card>
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {props.itemData.title}
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
    height: 180,
    width: '93%',
    margin: '1.5%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 15,
  },
  statusBadge: {
    padding: 0,
    margin: 0,
    top: 0,
    position: 'absolute',
    width: '100%',
    zIndex: 100,
  },
  horizontalProduct: {
    height: 180,
    width: 180,
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
    width: 180,
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 8,
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
