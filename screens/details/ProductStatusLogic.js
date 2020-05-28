import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Platform } from 'react-native';
import { useSelector } from 'react-redux';

//Imports
import StatusBadge from '../../components/UI/StatusBadge';
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
  let statusText;
  let statusIcon;
  let statusColor;
  let promptText;
  let bgColor;

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';

  const loggedInUserId = useSelector((state) => state.auth.userId);

  const viewerIsSeller = loggedInUserId === ownerId;
  const viewerIsBuyer = loggedInUserId === (reservedUserId || collectingUserId);
  const youHaveNotAgreed = viewerIsBuyer ? !buyerAgreed : viewerIsSeller ? !sellerAgreed : null;
  const waitingForYou = (viewerIsBuyer && youHaveNotAgreed) || (viewerIsSeller && youHaveNotAgreed);

  if (isReserved) {
    statusText = `Reserverad tills ${Moment(reservedUntil).locale('sv').calendar()}`;
    statusIcon = 'bookmark';
    statusColor = Colors.primary;
  }

  if (isOrganised) {
    statusText = `Upphämtning satt till ${Moment(collectingDate).locale('sv').calendar()}`;
    statusIcon = 'star';
    statusColor = Colors.subtleBlue;
  }

  if (isPickedUp) {
    statusText = 'Hämtad';
    statusIcon = 'checkmark';
    statusColor = Colors.completed;
  }

  if (suggestedDate) {
    promptText = `Tid föreslagen, ${
      waitingForYou ? 'väntar på ditt godkännande ' : 'väntar på motparts godkännande'
    }`;
    bgColor = waitingForYou ? Colors.darkPrimary : Colors.subtlePurple;
  }

  if (!suggestedDate) {
    promptText = "Inget förslag än, föreslå en tid via 'logistik' nedan";
    bgColor = Colors.darkPrimary;
  }

  return (
    <View style={{ marginTop: 20 }}>
      {/* If we have a status of the product, show a badge with conditional copy */}
      <StatusBadge
        style={{ alignSelf: 'flex-end' }}
        text={statusText}
        icon={Platform.OS === 'android' ? `md-${statusIcon}` : `ios-${statusIcon}`}
        backgroundColor={statusColor}
      />
      {!isPickedUp && !isOrganised ? (
        <StatusBadge
          style={{ alignSelf: 'flex-end' }}
          textStyle={{
            textAlign: 'right',
          }}
          text={promptText}
          icon={Platform.OS === 'android' ? 'md-information-circle' : 'ios-information-circle'}
          backgroundColor={bgColor}
        />
      ) : null}
    </View>
  );
};

export default ProductStatusLogic;
