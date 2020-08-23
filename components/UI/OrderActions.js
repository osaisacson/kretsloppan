import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as ordersActions from '../../store/actions/orders';
import * as productsActions from '../../store/actions/products';
import ButtonAction from './ButtonAction';
import CalendarSelection from './CalendarSelection';

const OrderActions = ({ order, isSeller, isBuyer }) => {
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
    const buyerHasAgreed = !!isBuyer;
    const sellerHasAgreed = !!isSeller;
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
    const buyerJustAgreed = isBuyer ? true : buyerAgreed;
    const sellerJustAgreed = isSeller ? true : sellerAgreed;

    Alert.alert(
      'Bekräfta tid',
      `Genom att klicka här godkänner du ${moment(suggestedDate)
        .locale('sv')
        .format(
          'D MMMM YYYY, HH:00'
        )} som upphämtningstid och åtar dig att på denna tid vara på plats/komma till platsen som står i posten under "upphämtningsdetaljer".`,
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
                buyerJustAgreed, //if the user agreeing to the time is the buyer, set as true
                sellerJustAgreed, //if the user agreeing to the time is the seller, set as true
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
    Alert.alert(
      'Är produkten levererad till beställaren?',
      'Genom att klicka här bekräftar du att ordern är klar.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Japp, den är klar!',
          style: 'destructive',
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
                true // order is collected
              )
            );
          },
        },
      ]
    );
  };

  const deleteHandler = (orderId, orderQuantity) => {
    const updatedProductAmount = Number(currentProduct.amount) + Number(orderQuantity);

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
        <ButtonAction
          buttonColor={Colors.subtleGrey}
          onSelect={toggleShowCalendar}
          title="ändra tid"
        />
        <ButtonAction
          buttonColor={Colors.approved}
          buttonLabelStyle={{ color: '#fff' }}
          title="hämtad!"
          onSelect={() => {
            collectHandler();
          }}
        />
        {/* Show button to approve the suggested pickup time if either 
        the seller or buyer has not agreed to the suggested time yet */}
        {(!buyerAgreed && isBuyer) || (!sellerAgreed && isSeller) ? (
          <ButtonAction
            buttonLabelStyle={{ color: '#fff' }}
            buttonColor={Colors.approved}
            title="godkänn upphämtningstid"
            onSelect={() => {
              approveSuggestedDateTime();
            }}
          />
        ) : null}
        {/* Show button to cancel the order if the viewer is the buyer */}
        {isBuyer ? (
          <ButtonAction
            buttonColor={Colors.warning}
            buttonLabelStyle={{ color: '#fff' }}
            onSelect={() => {
              deleteHandler(id, productId, quantity);
            }}
            title="avreservera"
          />
        ) : null}
      </View>
      {showCalendar ? (
        <>
          <CalendarSelection suggestedDate={suggestedDate} sendSuggestedTime={sendSuggestedTime} />
          <ButtonAction
            style={{ marginBottom: 20 }}
            buttonColor={Colors.subtleGrey}
            onSelect={() => {
              resetSuggestedDT(suggestedDate);
            }}
            title={`Ändra föreslagen tid till ${moment(orderSuggestedDate)
              .locale('sv')
              .format('D MMMM YYYY, HH:mm')}`}
          />
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default OrderActions;
