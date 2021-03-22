import moment from 'moment/min/moment-with-locales';
import React from 'react';

import ButtonIcon from './ButtonIcon';
import { View, StyleSheet } from 'react-native';
import { pure } from 'recompose';

import Colors from '../../constants/Colors';
import ButtonRound from './ButtonRound';

const OrderButtonSection = ({
  orderId,
  productId,
  quantity,
  suggestedDate,
  isAgreed,
  isCollected,
  isTimeInitiator,
  buyerId,
  timeInitiatorId,
  loggedInUserId,
  sellerProfileName,
  buyerProfileName,
  timeInitiatorName,
  toggleShowCalendar,
  approveSuggestedDateTime,
  collectOrder,
  deleteOrder,
}) => {
  return (
    <>
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
                  timeInitiatorId === buyerId ? sellerProfileName : buyerProfileName
                }`}
              />
            ) : (
              <ButtonRound
                style={{ backgroundColor: Colors.primary }}
                title={`${timeInitiatorName} föreslog ${moment(suggestedDate)
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
            title={`Hämtas av ${loggedInUserId === buyerId ? 'dig' : buyerProfileName} ${moment(
              suggestedDate
            )
              .locale('sv')
              .format('HH:mm, D MMMM')}. Klicka här när hämtad!`}
            onSelect={() => {
              collectOrder();
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
            title={`Hämtad av ${loggedInUserId === buyerId ? 'dig' : buyerProfileName} ${moment(
              isCollected
            )
              .locale('sv')
              .format('HH:mm, D MMMM YYYY')}`}
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
              icon="delete"
              color={Colors.neutral}
              onSelect={() => {
                deleteOrder(orderId, productId, quantity);
              }}
            />
            {/* Show button to change pickup time */}
            <ButtonIcon
              icon="pen"
              color={Colors.neutral}
              onSelect={() => {
                toggleShowCalendar();
              }}
            />
          </View>
        ) : null}
      </View>
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

export default pure(OrderButtonSection);
