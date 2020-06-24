import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import InfoText from './../../components/UI/InfoText';

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
    address,
  } = props.selectedProduct;

  //These will change based on where we are in the reservation process
  let statusText = '';

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isTouched = isReserved || isOrganised || isPickedUp;

  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.id;

  const viewerIsSeller = loggedInUserId === ownerId;
  const viewerIsBuyer = loggedInUserId === (reservedUserId || collectingUserId);
  const youHaveNotAgreed = viewerIsBuyer ? !buyerAgreed : viewerIsSeller ? !sellerAgreed : null;
  const waitingForYou = (viewerIsBuyer && youHaveNotAgreed) || (viewerIsSeller && youHaveNotAgreed);
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const hasEditPermission = ownerId === loggedInUserId;
  const isSellerOrBuyer = hasEditPermission || isReservedUser || isOrganisedUser;

  let secondLine;
  let thirdLine;

  if (isReserved) {
    statusText = `Reserverad tills ${Moment(reservedUntil).locale('sv').calendar()}`;
  }

  if (isOrganised) {
    statusText = `Hämtas av ${viewerIsBuyer ? 'dig' : 'köpare'} ${Moment(collectingDate)
      .locale('sv')
      .format('D MMMM HH:MM')}`;
    secondLine = `Från: ${address}`;
  }

  const sellerOrBuyer = sellerAgreed ? 'köparens' : 'säljarens';

  if (suggestedDate) {
    statusText = `Föreslagen tid av ${waitingForYou ? 'motpart' : 'dig'}: ${Moment(suggestedDate)
      .locale('sv')
      .format('D MMMM, HH:MM')}  `;
    secondLine = `Väntar på ${waitingForYou ? 'ditt' : sellerOrBuyer} godkännande`;
    thirdLine = `Reservation går ut ${Moment(reservedUntil).locale('sv').endOf('day').fromNow()}`;
  }

  if (isPickedUp) {
    statusText = 'Hämtad';
  }

  if (!isPickedUp && !isOrganised && !suggestedDate) {
    statusText = 'Inget förslag för upphämtning ännu';
    secondLine = `Föreslå en tid som passar dig via 'hantera detaljer' nedan`;
  }

  const statusTextFormattedLow = statusText.toLowerCase(); //Make moment() text lowercase
  const statusTextFormatted =
    statusTextFormattedLow.charAt(0).toUpperCase() + statusTextFormattedLow.slice(1); //Make first letter of sentence uppercase

  if (!isTouched) {
    return null;
  }

  return (
    <View style={{ marginBottom: 5 }}>
      {isSellerOrBuyer ? (
        <>
          <InfoText text={statusTextFormatted} />
          {secondLine ? <InfoText isBold text={secondLine} /> : null}
          {thirdLine ? <InfoText text={thirdLine} /> : null}
        </>
      ) : null}
    </View>
  );
};

export default ProductStatusLogic;
