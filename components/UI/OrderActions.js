import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as ordersActions from '../../store/actions/orders';
import * as productsActions from '../../store/actions/products';
import ButtonConfirm from './ButtonConfirm';
import ButtonRound from './ButtonRound';
import CalendarSelection from './CalendarSelection';

const OrderActions = ({ order, isSeller, isBuyer, loggedInUserId }) => {
  const dispatch = useDispatch();

  const {
    id,
    productId,
    projectId,
    quantity,
    reservedUntil,
    suggestedDate,
    buyerAgreed,
    sellerAgreed,
    isCollected,
  } = order;

  const products = useSelector((state) => state.products.availableProducts);
  const currentProduct = products.find((prod) => prod.id === productId);

  const [showCalendar, setShowCalendar] = useState(false);
  const [orderSuggestedDate, setOrderSuggestedDate] = useState();

  const bothAgreedOnTime = buyerAgreed && sellerAgreed && suggestedDate;

  const reservedDateHasExpired =
    new Date(reservedUntil) instanceof Date && new Date(reservedUntil) <= new Date();

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
    //set these according to who's trying to change the time. Should be true for the one changing time, false for the other.
    const buyerHasAgreed = isBuyer ? true : false;
    const sellerHasAgreed = isSeller ? true : false;
    const currentDate = new Date();
    const newReservedUntil = new Date(
      currentDate.getTime() + 4 * 24 * 60 * 60 * 1000
    ).toISOString();

    console.log('OrderActions/resetSuggestedDT, passed args');
    console.log({
      id,
      projectId,
      quantity,
      newReservedUntil, //updated date until which the product is reserved
      orderSuggestedDate, //updated suggested pickup date
      buyerHasAgreed, //if user changing the time is the buyer, set as true
      sellerHasAgreed, //if user changing the time is the seller, set as true
      isCollected,
    });
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
                projectId,
                quantity,
                newReservedUntil, //updated date until which the product is reserved
                orderSuggestedDate, //updated suggested pickup date
                buyerHasAgreed, //if user changing the time is the buyer, set as true
                sellerHasAgreed, //if user changing the time is the seller, set as true
                isCollected
              )
            );
            toggleShowCalendar();
          },
        },
      ]
    );
  };

  //Approve suggested pickup time
  const approveSuggestedDateTime = () => {
    const buyerJustAgreed = isBuyer ? true : buyerAgreed; //if the user agreeing to the time is the buyer, set as true
    const sellerJustAgreed = isSeller ? true : sellerAgreed; //if the user agreeing to the time is the seller, set as true
    console.log({
      order,
    });

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
                projectId,
                quantity,
                reservedUntil,
                suggestedDate,
                buyerJustAgreed,
                sellerJustAgreed,
                isCollected
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
    console.log({ originalSoldProducts, quantity, totalSoldProducts });

    Alert.alert(
      'Är produkten levererad till beställaren?',
      'Genom att klicka här bekräftar du att ordern är klar.',
      [
        {
          text: 'Japp, den är klar!',
          style: 'default',
          onPress: () => {
            dispatch(
              ordersActions.updateOrder(
                id,
                projectId,
                quantity,
                reservedUntil,
                suggestedDate,
                true, // buyer has agreed
                true, // seller has agreed
                new Date() // order is collected
              )
            );
            dispatch(productsActions.updateProductSoldAmount(productId, totalSoldProducts));
          },
        },
        { text: 'Nej', style: 'destructive' },
      ]
    );
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
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}>
        <View>
          {/* When the buyer are seller are in the process of agreeing on a pickup time, show a button for agreeing or suggesting a time */}
          {!bothAgreedOnTime ? (
            <ButtonRound
              style={{ backgroundColor: Colors.darkPrimary }}
              title={
                suggestedDate
                  ? `Godkänn ${moment(suggestedDate)
                      .locale('sv')
                      .format('HH:mm, D MMMM YYYY')} som tid för upphämtning`
                  : 'Föreslå tid för upphämtning'
              }
              onSelect={() => {
                suggestedDate ? approveSuggestedDateTime() : toggleShowCalendar();
              }}
            />
          ) : null}

          {/* When both parties have agreed on a time show a button for marking the order as collected*/}
          {bothAgreedOnTime ? (
            <ButtonRound
              style={{ backgroundColor: Colors.completed }}
              title="Klicka här när hämtad!"
              onSelect={() => {
                collectHandler();
              }}
            />
          ) : null}

          {/* As long as the order has not been collected, show the options to edit the order */}
          {!isCollected ? (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>
              {/* Show button to change pickup time */}
              <Button
                raised
                buttonStyle={{ backgroundColor: 'transparent' }}
                containerStyle={{ width: '45%' }}
                onPress={toggleShowCalendar}
                icon={<AntDesign name="edit" size={17} color={Colors.subtleBlue} />}
              />
              {/* Show button to cancel the order */}
              <Button
                raised
                buttonStyle={{ backgroundColor: 'transparent' }}
                containerStyle={{ marginLeft: 10, width: '45%' }}
                onPress={() => {
                  deleteHandler(id, productId, quantity);
                }}
                icon={<AntDesign name="delete" size={17} color={Colors.warning} />}
              />
            </View>
          ) : null}
        </View>

        {/* Show a disabled button when the order has been collected */}
        {isCollected ? <ButtonRound disabled title="Hämtad!" /> : null}
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

export default OrderActions;
