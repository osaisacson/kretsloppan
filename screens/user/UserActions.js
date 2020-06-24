import React from 'react';
import { View } from 'react-native';

import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Colors from '../../constants/Colors';

const UserActions = (props) => {
  const { reservedProducts, toBeBought, toBeSold, navigation } = props;

  return (
    <View
      style={{
        backgroundColor: Colors.lightPrimary,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
      }}>
      {reservedProducts.length ? (
        <HorizontalScroll
          title="Reservationer"
          subTitle="Väntar på att ni kommer överens om tid för upphämtning/avlämning"
          scrollData={reservedProducts}
          showNotificationBadge
          navigation={navigation}
        />
      ) : null}
      {toBeBought.length ? (
        <HorizontalScroll
          title="Överenskommet - att köpas"
          subTitle="Väntar på att köpas och hämtas av dig på överenskommen tid."
          scrollData={toBeBought}
          showNotificationBadge
          navigation={navigation}
        />
      ) : null}
      {toBeSold.length ? (
        <HorizontalScroll
          title="Överenskommet - att säljas"
          subTitle="Väntar på att säljas och lämnas av dig på överenskommen tid."
          scrollData={toBeSold}
          showNotificationBadge
          navigation={navigation}
        />
      ) : null}
    </View>
  );
};

export default UserActions;
