import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { View, Text, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as ordersActions from '../../store/actions/orders';
import * as productsActions from '../../store/actions/products';
import ButtonConfirm from './ButtonConfirm';
import ButtonRound from './ButtonRound';
import CalendarSelection from './CalendarSelection';
import UserAvatar from './UserAvatar';

const OrderActions = ({ navigation, loggedInUserId, order, isProductDetail }) => {
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
    reservedUntil,
    suggestedDate,
    isAgreed,
    isCollected,
  } = order;

  const products = useSelector((state) => state.products.availableProducts);
  const currentProduct = products.find((prod) => prod.id === productId);

  const [showCalendar, setShowCalendar] = useState(false);
  const [orderSuggestedDate, setOrderSuggestedDate] = useState();

  // Identifies who is currently watching the order
  const isBuyer = loggedInUserId === buyerId;
  const isSeller = loggedInUserId === sellerId;
  const isTimeInitiator = loggedInUserId === timeInitiatorId;

  // Identifies which user information is most relevant for the logged in user to see
  const infoId = loggedInUserId === buyerId ? sellerId : buyerId;
  const profiles = useSelector((state) => state.profiles.allProfiles);
  const infoProfile = profiles.find((profile) => profile.profileId === buyerId);

  const reservedDateHasExpired =
    new Date(reservedUntil) instanceof Date && new Date(reservedUntil) <= new Date();

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
    const currentDate = new Date();
    const newReservedUntil = new Date(
      currentDate.getTime() + 4 * 24 * 60 * 60 * 1000
    ).toISOString();

    console.log('START-----------------');
    console.log('OrderActions/resetSuggestedDT, passed args');
    console.log('id', id);
    console.log('timeInitiatorId/loggedInUserId:', loggedInUserId);
    console.log('projectId', projectId);
    console.log('quantity', quantity);
    console.log('newReservedUntil', newReservedUntil);
    console.log('orderSuggestedDate', orderSuggestedDate);
    console.log('isAgreed should be false', false);
    console.log('isCollected should be false', false);
    console.log('-----------------END');

    Alert.alert(
      'Ändra tid',
      'Genom att klicka här ändrar du den föreslagna tiden. Ni får då igen fyra dagar på er att komma överens om en tid.',
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
                newReservedUntil, //updated date until which the product is reserved
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
    console.log('reservedUntil', reservedUntil);
    console.log('suggestedDate', suggestedDate);
    console.log('isAgreed should be true', true);
    console.log('isCollected should be false', false);
    console.log('-----------------END');

    Alert.alert(
      'Bekräfta tid',
      `Genom att klicka här lovar du att vara på addressen för upphämtning den ${moment(
        suggestedDate
      )
        .locale('sv')
        .format('D MMMM YYYY, HH:mm')}`,
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
                reservedUntil,
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
    const originalSoldProducts = currentProduct.sold ? currentProduct.sold : 0;
    const totalSoldProducts = originalSoldProducts + quantity; //Existing sold items plus the quantity of the currently completed order
    console.log('START-----------------');
    console.log('OrderActions/approveSuggestedDateTime, passed args');
    console.log('-----');
    console.log('For updateProductSoldAmount()');
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
    console.log('reservedUntil', reservedUntil);
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
              reservedUntil,
              suggestedDate,
              true, //isAgreed will be true as nothing has changed with the pickup time
              new Date() //isCollected will be set as today's date as the item was just confirmed as collected
            )
          );

          dispatch(productsActions.updateProductSoldAmount(productId, totalSoldProducts));
        },
      },
      { text: 'Nej', style: 'destructive' },
    ]);
  };

  const deleteHandler = (orderId, productId, orderQuantity) => {
    const updatedProductAmount = Number(currentProduct.amount) + Number(orderQuantity);
    console.log({ orderId, productId, orderQuantity, updatedProductAmount });

    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här reservationen? Det går inte att gå ändra sig när det väl är gjort.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(ordersActions.deleteOrder(orderId));
            dispatch(productsActions.updateProductAmount(productId, updatedProductAmount));
          },
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.oneLineSpread}>
        {/*  IMAGES */}
        {/* If we are on the product detail screen show the user avatar amd always show 'buyer' as text...*/}
        {isProductDetail ? (
          <View style={styles.textAndBadge}>
            <UserAvatar
              userId={buyerId}
              size={70}
              style={{ margin: 0 }}
              showBadge={false}
              actionOnPress={() => {
                navigation.navigate('Användare', {
                  detailId: buyerId,
                });
              }}
            />
            <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -60 }]}>
              <Text style={styles.smallText}>Köpare</Text>
            </View>
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
          {suggestedDate && !isAgreed ? (
            <>
              {/* Show 'Waiting for x to approve time' or 'Approve x time'  */}
              {isTimeInitiator ? (
                <ButtonRound
                  disabled
                  title={`Väntar på att ${infoProfile.profileName} ska godkänna föreslagen tid`}
                />
              ) : (
                <ButtonRound
                  style={{ backgroundColor: Colors.primary }}
                  title={`Godkänn ${moment(suggestedDate)
                    .locale('sv')
                    .format('HH:mm, D MMMM YYYY')} som tid för upphämtning`}
                  onSelect={() => {
                    approveSuggestedDateTime();
                  }}
                />
              )}
            </>
          ) : null}
          {/* When both parties have agreed on a time show a button for marking the order as collected*/}
          {isAgreed ? (
            <ButtonRound
              style={{ backgroundColor: Colors.completed }}
              title="Klicka här när hämtad!"
              onSelect={() => {
                collectHandler();
              }}
            />
          ) : null}
          {/* Show a disabled button when the order has been collected */}
          {isCollected ? <ButtonRound disabled title="Hämtad!" /> : null}

          {/* EDIT AND DELETE OPTIONS */}
          {/* As long as the order has not been collected, show the options to edit the order */}
          {!isCollected ? (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
              {/* Show button to cancel the order */}
              <Button
                raised
                buttonStyle={{ backgroundColor: 'transparent' }}
                containerStyle={{ width: 45 }}
                onPress={() => {
                  deleteHandler(id, productId, quantity);
                }}
                icon={<AntDesign name="close" size={17} color={Colors.warning} />}
              />
              {/* Show button to change pickup time */}
              <Button
                raised
                buttonStyle={{ backgroundColor: 'transparent' }}
                containerStyle={{ marginLeft: 10, width: 45 }}
                onPress={toggleShowCalendar}
                icon={<AntDesign name="edit" size={17} color={Colors.subtleBlue} />}
              />
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
          {/* Show a section with the newly suggested time if it exists */}
          {/* {orderSuggestedDate ? (
            <Card>
              <Card.Title>FÖRESLAGEN NY TID</Card.Title>
              <Card.Title>
                {moment(orderSuggestedDate).locale('sv').format('D MMMM YYYY, HH:mm')}
              </Card.Title>
            </Card>
          ) : null} */}
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

export default OrderActions;
