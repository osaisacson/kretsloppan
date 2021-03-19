import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { Avatar } from 'react-native-paper';
import TouchableCmp from '../../components/UI/TouchableCmp';

import ButtonIcon from '../../components/UI/ButtonIcon';
import { View, Text, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { pure } from 'recompose';

import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as ordersActions from '../../store/actions/orders';
import * as productsActions from '../../store/actions/products';
import ButtonConfirm from './ButtonConfirm';
import ButtonRound from './ButtonRound';
import CalendarSelection from './CalendarSelection';
import UserAvatar from './UserAvatar';

const OrderActions = ({
  navigation,
  loggedInUserId,
  order,
  isProductDetail,
  products,
  profiles,
  projectForProduct,
}) => {
  const dispatch = useDispatch();

  const {
    id,
    buyerId,
    sellerId,
    timeInitiatorId,
    productId,
    projectId,
    quantity,
    image,
    suggestedDate,
    isAgreed,
    isCollected,
  } = order;

  const currentProduct = products.find((prod) => prod.id === productId);

  const {
    category,
    condition,
    style,
    material,
    color,
    title,
    amount,
    address,
    location,
    pickupDetails,
    phone,
    description,
    background,
    length,
    height,
    width,
    price,
    priceText,
    internalComments,
    booked,
    sold,
  } = currentProduct;

  const [showCalendar, setShowCalendar] = useState(false);
  const [orderSuggestedDate, setOrderSuggestedDate] = useState();

  // Identifies who is currently watching the order
  const isTimeInitiator = loggedInUserId === timeInitiatorId;
  const timeInitiatorProfile = profiles.find((profile) => profile.profileId === timeInitiatorId);
  const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
  const sellerProfile = profiles.find((profile) => profile.profileId === sellerId);

  // Identifies which user information is most relevant for the logged in user to see
  const infoId = loggedInUserId === buyerId ? sellerId : buyerId;

  const goToItem = () => {
    navigation.navigate('ProductDetail', { detailId: productId });
  };

  //Show and reset time/date for pickup
  const toggleShowCalendar = () => {
    setShowCalendar((prevState) => !prevState);
  };

  const sendSuggestedTime = (dateTime) => {
    console.log(
      'OrderActions/sendSuggestedTime: attempting to set the selected dateTime in parent to: ',
      dateTime
    );
    setOrderSuggestedDate(dateTime);
  };

  const resetSuggestedDT = () => {
    console.log('START-----------------');
    console.log('OrderActions/resetSuggestedDT, passed args');
    console.log('id', id);
    console.log('timeInitiatorId/loggedInUserId:', loggedInUserId);
    console.log('projectId', projectId);
    console.log('quantity', quantity);
    console.log('orderSuggestedDate', orderSuggestedDate);
    console.log('isAgreed should be false', false);
    console.log('isCollected should be false', false);
    console.log('-----------------END');

    Alert.alert(
      'Ändra tid',
      `Genom att klicka här ändrar du den föreslagna tiden till ${moment(orderSuggestedDate)
        .locale('sv')
        .format('HH:mm, D MMMM')}. Ni får då igen fyra dagar på er att komma överens om en tid.`,
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              ordersActions.updateOrder(
                id,
                loggedInUserId, //the timeInitiatorId will be the one of the logged in user as they are the ones initiating the change
                projectId,
                quantity,
                orderSuggestedDate, //updated suggested pickup date
                false, //isAgreed will be false as we are resetting the time
                false //isCollected will be false as we are setting up a new time for collection
              )
            );
            toggleShowCalendar();
          },
        },
      ]
    );
  };

  //Approve suggested pickup time: should only be available for the user who did not initiate the originally
  //proposed time, which means once this is clicked the 'isAgreed' flag should be set to true.
  const approveSuggestedDateTime = () => {
    console.log({
      order,
    });

    console.log('START-----------------');
    console.log('OrderActions/approveSuggestedDateTime, passed args');
    console.log('id', id);
    console.log('timeInitiatorId:', timeInitiatorId);
    console.log('projectId', projectId);
    console.log('quantity', quantity);
    console.log('suggestedDate', suggestedDate);
    console.log('isAgreed should be true', true);
    console.log('isCollected should be false', false);
    console.log('-----------------END');

    Alert.alert(
      'Bekräfta tid',
      `Genom att klicka här lovar du att vara på addressen för upphämtning ${moment(suggestedDate)
        .locale('sv')
        .format('HH:mm, D MMMM')}`,
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              ordersActions.updateOrder(
                id,
                timeInitiatorId, //this stays the same as previously, only updates if we try to change the time
                projectId,
                quantity,
                suggestedDate,
                true, //isAgreed will be true as the second party just confirmed the time
                false //isCollected will be false as we just agreed on time for collection
              )
            );
          },
        },
      ]
    );
  };

  //Set order as completed
  const collectHandler = () => {
    const originalSoldProducts = sold ? sold : 0;
    const totalSoldProducts = originalSoldProducts + quantity; //Existing sold items plus the quantity of the currently completed order
    console.log('START-----------------');
    console.log('OrderActions/approveSuggestedDateTime, passed args');
    console.log('-----');
    console.log('For updateProduct()');
    console.log('Prep:');
    console.log({ originalSoldProducts, quantity });
    console.log('Passed:');
    console.log('productId:', productId);
    console.log('totalSoldProducts', totalSoldProducts);
    console.log('-----');
    console.log('For updateOrder()');
    console.log('id', id);
    console.log('timeInitiatorId:', timeInitiatorId);
    console.log('projectId', projectId);
    console.log('quantity', quantity);
    console.log('suggestedDate', suggestedDate);
    console.log('isAgreed should be true', true);
    console.log('isCollected should be false', false);
    console.log('-----------------END');

    Alert.alert('Är produkten hämtad?', 'Genom att klicka här bekräftar du att ordern är klar.', [
      {
        text: 'Japp, den är klar!',
        style: 'default',
        onPress: () => {
          dispatch(
            ordersActions.updateOrder(
              id,
              timeInitiatorId, //this stays the same as previously, only updates if we try to change the time
              projectId,
              quantity,
              suggestedDate,
              true, //isAgreed will be true as nothing has changed with the pickup time
              new Date() //isCollected will be set as today's date as the item was just confirmed as collected
            )
          );

          dispatch(
            productsActions.updateProduct(
              productId,
              category,
              condition,
              style,
              material,
              color,
              title,
              amount,
              image,
              address,
              location,
              pickupDetails,
              phone,
              description,
              background,
              length,
              height,
              width,
              price,
              priceText,
              internalComments,
              booked,
              totalSoldProducts
            )
          );
        },
      },
      { text: 'Nej', style: 'destructive' },
    ]);
  };

  const deleteHandler = (orderId, productId, orderQuantity) => {
    const updatedBookedProducts = Number(booked === undefined ? 0 : booked) - Number(orderQuantity);
    console.log('START-----------------');
    console.log('OrderActions/deleteHandler, passed args');
    console.log('Prep:');
    console.log({ orderId, orderQuantity });
    console.log('To updateProduct:');
    console.log({
      productId,
      category,
      condition,
      style,
      material,
      color,
      title,
      amount,
      image,
      address,
      location,
      pickupDetails,
      phone,
      description,
      background,
      length,
      height,
      width,
      price,
      priceText,
      internalComments,
      updatedBookedProducts, //updated number for how many products have been booked
      sold,
    });
    console.log('-----------------END');

    Alert.alert('Är du säker?', 'Vill du verkligen ta bort den här reservationen?', [
      { text: 'Nej', style: 'default' },
      {
        text: 'Ja, ta bort',
        style: 'destructive',
        onPress: () => {
          dispatch(ordersActions.deleteOrder(orderId));
          dispatch(
            productsActions.updateProduct(
              productId,
              category,
              condition,
              style,
              material,
              color,
              title,
              amount,
              image,
              address,
              location,
              pickupDetails,
              phone,
              description,
              background,
              length,
              height,
              width,
              price,
              priceText,
              internalComments,
              updatedBookedProducts, //updated number for how many products have been booked
              sold
            )
          );
        },
      },
    ]);
  };

  return (
    <>
      <View style={styles.oneLineSpread}>
        {/*  IMAGES */}
        {/* If we are on the product detail screen show the user avatar amd always show 'buyer' as text...*/}
        {isProductDetail ? (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <UserAvatar
                userId={buyerId}
                size={90}
                style={{ margin: 0 }}
                showBadge={false}
                actionOnPress={() => {
                  navigation.navigate('Användare', {
                    detailId: buyerId,
                  });
                }}
              />
              <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -70 }]}>
                <Text style={styles.smallText}>Köpare</Text>
              </View>
            </View>
            {projectForProduct.id ? (
              <View style={{ flex: 1, flexDirection: 'row', marginTop: 5 }}>
                <TouchableCmp
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate('ProjectDetail', {
                      detailId: projectForProduct.id,
                    });
                  }}>
                  <Avatar.Image
                    style={{
                      color: '#fff',
                      backgroundColor: '#fff',
                      borderWidth: 0.5,
                      borderColor: '#666',
                    }}
                    source={{ uri: projectForProduct.image }}
                    size={80}
                  />
                </TouchableCmp>
                <View
                  style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -80 }]}>
                  <Text style={styles.smallText}>Till projekt</Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <TouchableOpacity onPress={goToItem}>
            <Image
              style={{
                borderRadius: 5,
                width: 140,
                height: 140,
                resizeMode: 'contain',
              }}
              source={{ uri: image }}
            />
          </TouchableOpacity>
        )}
        {/* ...else show the product image  */}

        <Divider style={{ width: 1, height: '100%', marginHorizontal: 8 }} />

        {/* BUTTONS */}
        <View>
          {/* When we don't have a time suggested yet */}
          {!suggestedDate ? (
            <ButtonRound
              style={{ backgroundColor: Colors.darkPrimary }}
              title={'Föreslå tid för upphämtning'}
              onSelect={() => {
                toggleShowCalendar();
              }}
            />
          ) : null}
          {/* When we are waiting for the other to approve a suggested time */}
          {suggestedDate && !isAgreed && !isCollected ? (
            <>
              {/* Show 'Waiting for x to approve time' or 'Approve x time'  */}
              {isTimeInitiator ? (
                <ButtonRound
                  disabled
                  title={`Tid föreslagen av dig, väntar på godkännande av ${
                    timeInitiatorId === buyerId
                      ? sellerProfile.profileName
                      : buyerProfile.profileName
                  }`}
                />
              ) : (
                <ButtonRound
                  style={{ backgroundColor: Colors.primary }}
                  title={`${timeInitiatorProfile.profileName} föreslog ${moment(suggestedDate)
                    .locale('sv')
                    .format('HH:mm, D MMMM')}, godkänn?`}
                  onSelect={() => {
                    approveSuggestedDateTime();
                  }}
                />
              )}
            </>
          ) : null}
          {/* When both parties have agreed on a time show a button for marking the order as collected*/}
          {isAgreed && !isCollected ? (
            <ButtonRound
              style={{ backgroundColor: Colors.completed }}
              title={`Hämtas av ${
                loggedInUserId === buyerId ? 'dig' : buyerProfile.profileName
              } ${moment(suggestedDate)
                .locale('sv')
                .format('HH:mm, D MMMM')}. Klicka här när hämtad!`}
              onSelect={() => {
                collectHandler();
              }}
            />
          ) : null}
          {/* Show a disabled button when the order has been collected */}
          {isCollected ? (
            <ButtonRound
              disabled
              style={{
                backgroundColor: '#fff',

                borderColor: Colors.completed,
                borderSize: 1,
              }}
              titleStyle={{ color: Colors.completed }}
              title={`Hämtad av ${
                loggedInUserId === buyerId ? 'dig' : buyerProfile.profileName
              } ${moment(isCollected).locale('sv').format('HH:mm, D MMMM YYYY')}`}
            />
          ) : null}

          {/* EDIT AND DELETE OPTIONS */}
          {/* As long as the order has not been collected, show the options to edit the order */}
          {!isCollected ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginTop: 8,
              }}>
              {/* Show button to cancel the order */}
              <ButtonIcon
                icon="close"
                color={Colors.neutral}
                onSelect={() => {
                  deleteHandler(id, productId, quantity);
                }}
              />
              {/* Show button to change pickup time */}
              <ButtonIcon icon="pen" color={Colors.neutral} onSelect={toggleShowCalendar} />
            </View>
          ) : null}
        </View>

        {!isProductDetail ? (
          <>
            {/* Show large user avatar of the buyer */}
            <View style={styles.textAndBadge}>
              <UserAvatar
                userId={infoId}
                size={70}
                style={{ margin: 0 }}
                showBadge={false}
                actionOnPress={() => {
                  navigation.navigate('Användare', {
                    detailId: infoId,
                  });
                }}
              />
              <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -60 }]}>
                <Text style={styles.smallText}>{infoId === buyerId ? 'Köpare' : 'Säljare'}</Text>
              </View>
            </View>
          </>
        ) : null}
      </View>

      {showCalendar ? (
        <View style={{ flex: 1 }}>
          <CalendarSelection suggestedDate={suggestedDate} sendSuggestedTime={sendSuggestedTime} />
          <ButtonConfirm
            onSelect={() => {
              resetSuggestedDT(suggestedDate);
            }}
            title="Spara"
          />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  textAndBadge: {
    marginLeft: 20,
    marginBottom: 70,
    flex: 1,
    flexDirection: 'row',
  },
  smallBadge: {
    zIndex: 10,
    paddingHorizontal: 2,
    borderRadius: 5,
    height: 17,
  },
  smallText: {
    textTransform: 'uppercase',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },
});

export default pure(OrderActions);
