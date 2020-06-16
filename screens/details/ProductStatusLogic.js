import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import Colors from '../../constants/Colors';

const ProductStatusLogic = (props) => {
  const {
    status,
    reservedUntil,
    collectingDate,
    ownerId,
    reservedUserId,
    collectingUserId,
    buyerAgreed,
    sellerAgreed,
    suggestedDate,
  } = props.selectedProduct;

  //These will change based on where we are in the reservation process
  let statusText = '';
  let promptText;

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isTouched = isReserved || isOrganised || isPickedUp;

  const loggedInUserId = useSelector((state) => state.auth.userId);

  const viewerIsSeller = loggedInUserId === ownerId;
  const viewerIsBuyer = loggedInUserId === (reservedUserId || collectingUserId);
  const youHaveNotAgreed = viewerIsBuyer ? !buyerAgreed : viewerIsSeller ? !sellerAgreed : null;
  const waitingForYou = (viewerIsBuyer && youHaveNotAgreed) || (viewerIsSeller && youHaveNotAgreed);

  if (isReserved) {
    statusText = `Reserverad tills ${Moment(reservedUntil).locale('sv').calendar()}`;
  }

  if (isOrganised) {
    statusText = `Upphämtning satt till ${Moment(collectingDate)
      .locale('sv')
      .format('D MMMM HH:MM')}`;
  }

  if (isPickedUp) {
    statusText = 'Hämtad';
  }

  if (suggestedDate) {
    promptText = `Tid föreslagen ${
      waitingForYou
        ? ', väntar på ditt godkännande '
        : `av dig, väntar på ${sellerAgreed ? 'köparens' : 'säljarens'} godkännande`
    }`;
  }

  if (!suggestedDate) {
    promptText = "Inget förslag än, föreslå en tid via 'se detaljer' nedan";
  }

  const statusTextFormattedLow = statusText.toLowerCase(); //Make moment() text lowercase
  const statusTextFormatted =
    statusTextFormattedLow.charAt(0).toUpperCase() + statusTextFormattedLow.slice(1); //Make first letter of sentence uppercase

  if (!isTouched) {
    return null;
  }

  return (
    <View style={{ marginBottom: 5 }}>
      {/* If we have a status of the product, show a badge with conditional copy */}
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'roboto-light-italic',
        }}>
        {statusTextFormatted}
      </Text>
      {!isPickedUp && !isOrganised ? (
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'roboto-bold-italic',
          }}>
          {promptText}
        </Text>
      ) : null}
    </View>
  );
};

export default ProductStatusLogic;
