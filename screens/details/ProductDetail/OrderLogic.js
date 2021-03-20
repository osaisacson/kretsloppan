import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { Avatar } from 'react-native-paper';
import TouchableCmp from '../../../components/UI/TouchableCmp';

import { View, Text, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { pure } from 'recompose';

import { useDispatch } from 'react-redux';

import Colors from '../../../constants/Colors';
import * as ordersActions from '../../../store/actions/orders';
import * as productsActions from '../../../store/actions/products';
import CalendarSelection from '../../../components/UI/CalendarSelection';
import UserAvatar from '../../../components/UI/UserAvatar';
import OrderButtonSection from '../../../components/UI/OrderButtonSection';

const OrderLogic = ({
  navigation,
  loggedInUserId,
  order,
  isProductDetail,
  products,
  projectForProduct,
  isTimeInitiator,
  timeInitiatorProfile,
  buyerProfile,
  sellerProfile,
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

  const currentProduct = productId ? products.find((prod) => prod.id === productId) : {};

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

  // Identifies which user information is most relevant for the logged in user to see
  const infoId = loggedInUserId === buyerId ? sellerId : buyerId;

  const goToItem = () => {
    navigation.navigate('ProductDetail', { detailId: productId });
  };

  //Show and reset time/date for pickup
  const toggleShowCalendarHandler = () => {
    setShowCalendar((prevState) => !prevState);
  };

  //Approve suggested pickup time: should only be available for the user who did not initiate the originally
  //proposed time, which means once this is clicked the 'isAgreed' flag should be set to true.
  const approveSuggestedDateTimeHandler = () => {
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
    console.log('OrderLogic/approveSuggestedDateTime, passed args');
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
        {/* If we are on the product detail screen show the user avatar and always show 'buyer' as text...*/}
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
        <OrderButtonSection
          orderId={id}
          productId={productId}
          quantity={quantity}
          suggestedDate={suggestedDate}
          isAgreed={isAgreed}
          isCollected={isCollected}
          isTimeInitiator={isTimeInitiator}
          buyerId={buyerId}
          timeInitiatorId={timeInitiatorId}
          loggedInUserId={loggedInUserId}
          sellerProfileName={sellerProfile.profileName}
          buyerProfileName={buyerProfile.profileName}
          timeInitiatorName={timeInitiatorProfile.profileName}
          toggleShowCalendar={toggleShowCalendarHandler}
          approveSuggestedDateTime={approveSuggestedDateTimeHandler}
          collectOrder={collectHandler}
          deleteOrder={deleteHandler}
        />

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
          <CalendarSelection
            suggestedDate={suggestedDate}
            orderId={id}
            loggedInUserId={loggedInUserId}
            projectId={projectId}
            quantity={quantity}
            toggleShowCalendar={toggleShowCalendarHandler}
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

export default pure(OrderLogic);
