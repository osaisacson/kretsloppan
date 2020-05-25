import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Platform } from 'react-native';

//Imports
import StatusBadge from '../../components/UI/StatusBadge';
import Colors from '../../constants/Colors';

const ProductStatusLogic = (props) => {
  const {
    status,

    reservedUntil,
    collectingDate,
  } = props.selectedProduct;

  //These will change based on where we are in the reservation process
  let statusText;
  let statusIcon;
  let statusColor;

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';

  if (isReserved) {
    statusText = `Reserverad tills ${Moment(reservedUntil).locale('sv').calendar()}`;
    statusIcon = 'clock';
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

  return (
    <View style={{ marginTop: 20 }}>
      {/* If we have a status of the product, show a badge with conditional copy */}
      <StatusBadge
        style={{ alignSelf: 'flex-end' }}
        text={statusText}
        icon={Platform.OS === 'android' ? `md-${statusIcon}` : `ios-${statusIcon}`}
        backgroundColor={statusColor}
      />
    </View>
  );
};

export default ProductStatusLogic;
