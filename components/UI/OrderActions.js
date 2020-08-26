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

  const bothAgreedOnTime = buyerAgreed && sellerAgreed;

  const reservedDateHasExpired = false;

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
      `Genom att klicka här godkänner du ${moment(suggestedDate)
        .locale('sv')
        .format(
          'D MMMM YYYY, HH:mm'
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
      {!isCollected ? (
        <>
          {/* Show button to approve the suggested pickup time if either 
        the seller or buyer has not agreed to the suggested time yet */}
          {(!buyerAgreed && isBuyer) || (!sellerAgreed && isSeller) ? (
            <ButtonAction
              style={{ width: '95%' }}
              buttonLabelStyle={{ color: '#fff' }}
              buttonColor={Colors.approved}
              title="godkänn upphämtningstid"
              onSelect={() => {
                approveSuggestedDateTime();
              }}
            />
          ) : null}
          {bothAgreedOnTime ? (
            <ButtonAction
              style={{ width: '95%' }}
              buttonColor={Colors.approved}
              buttonLabelStyle={{ color: '#fff' }}
              title="hämtad!"
              onSelect={() => {
                collectHandler();
              }}
            />
          ) : null}
          <View style={styles.oneLineSpread}>
            <ButtonAction
              buttonColor={Colors.subtleGrey}
              onSelect={toggleShowCalendar}
              title="ändra tid"
            />

            {/* Show button to cancel the order if the viewer is the buyer */}
            {isBuyer || isSeller ? (
              <ButtonAction
                buttonColor={Colors.warning}
                buttonLabelStyle={{ color: '#fff' }}
                onSelect={() => {
                  deleteHandler(id, productId, quantity);
                }}
                disabled={isSeller && !reservedDateHasExpired}
                title={
                  isSeller && !reservedDateHasExpired
                    ? `Avreservera från ${moment(reservedUntil)
                        .locale('sv')
                        .format('D MMM YYYY, HH:mm')}`
                    : 'Avreservera'
                }
              />
            ) : null}
          </View>
          {showCalendar ? (
            <>
              <CalendarSelection
                suggestedDate={suggestedDate}
                sendSuggestedTime={sendSuggestedTime}
              />
              <ButtonAction
                style={{ marginBottom: 20 }}
                buttonColor={Colors.darkPrimary}
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
