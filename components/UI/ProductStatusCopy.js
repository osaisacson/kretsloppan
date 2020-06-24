import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const ProductStatusCopy = (props) => {
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

  //The texts for the status will change based on where we are in the reservation process
  let mainStatus = '';
  let secondaryStatus = '';
  let tertiaryStatus = '';

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isTouched = isReserved || isOrganised || isPickedUp;

  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  const viewerIsSeller = loggedInUserId === ownerId;
  const viewerIsBuyer = loggedInUserId === (reservedUserId || collectingUserId);
  const youHaveNotAgreed = viewerIsBuyer ? !buyerAgreed : viewerIsSeller ? !sellerAgreed : null;
  const waitingForYou = (viewerIsBuyer && youHaveNotAgreed) || (viewerIsSeller && youHaveNotAgreed);
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const hasEditPermission = ownerId === loggedInUserId;
  const isSellerOrBuyer = hasEditPermission || isReservedUser || isOrganisedUser;

  if (isReserved) {
    mainStatus = `Reserverad tills ${Moment(reservedUntil).locale('sv').calendar()}`;
  }

  if (isOrganised) {
    mainStatus = `Hämtas av ${viewerIsBuyer ? 'dig' : 'köpare'} ${Moment(collectingDate)
      .locale('sv')
      .format('D MMMM HH:MM')}`;
    secondaryStatus = `Från: ${address}`;
  }

  const sellerOrBuyer = sellerAgreed ? 'köparens' : 'säljarens';

  if (suggestedDate) {
    mainStatus = `Föreslagen tid av ${waitingForYou ? 'motpart' : 'dig'}: ${Moment(suggestedDate)
      .locale('sv')
      .format('D MMMM, HH:MM')}  `;
    secondaryStatus = `Väntar på ${waitingForYou ? 'ditt' : sellerOrBuyer} godkännande`;
    tertiaryStatus = `Reservation går ut ${Moment(reservedUntil)
      .locale('sv')
      .endOf('day')
      .fromNow()}`;
  }

  if (isPickedUp) {
    mainStatus = 'Hämtad';
  }

  if (!isPickedUp && !isOrganised && !suggestedDate) {
    mainStatus = 'Inget förslag för upphämtning ännu';
    secondaryStatus = `Föreslå en tid som passar dig via 'hantera detaljer' nedan`;
  }

  if (isReserved && !isOrganised && !hasEditPermission && !isReservedUser && !isOrganisedUser) {
    mainStatus = 'Parterna är i processen att ordna med logistik';
  }

  const mainStatusFormattedLow = mainStatus.toLowerCase(); //Make moment() text lowercase
  const mainStatusFormatted =
    mainStatusFormattedLow.charAt(0).toUpperCase() + mainStatusFormattedLow.slice(1); //Make first letter of sentence uppercase

  if (!isTouched) {
    return null;
  }

  const InfoText = (props) => {
    return (
      <Text
        style={
          props.isBold
            ? { ...styles.infoText, ...styles.infoTextEmphasis, ...props.style }
            : { ...styles.infoText, ...props.style }
        }>
        {props.text}
      </Text>
    );
  };

  return (
    <View style={{ marginBottom: 5, zIndex: 100 }}>
      {isSellerOrBuyer ? (
        <>
          <InfoText style={props.style} text={mainStatusFormatted} />
          {secondaryStatus ? <InfoText isBold style={props.style} text={secondaryStatus} /> : null}
          {tertiaryStatus ? <InfoText style={props.style} text={tertiaryStatus} /> : null}
        </>
      ) : null}
    </View>
  );
};

export default ProductStatusCopy;

const styles = StyleSheet.create({
  infoText: { fontFamily: 'roboto-light-italic' },
  infoTextEmphasis: { fontFamily: 'roboto-bold-italic' },
});
