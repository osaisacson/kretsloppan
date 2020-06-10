import React from 'react';

import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Colors from '../../constants/Colors';

const UserActions = (props) => {
  const { reservedProducts, toBeBought, toBeSold, navigation } = props;

  return (
    <>
      {reservedProducts.length ? (
        <HorizontalScroll
          title="Reservationer"
          subTitle="Väntar på att ni kommer överens om tid för upphämtning/avlämning"
          bgColor={Colors.lightPrimary}
          scrollData={reservedProducts}
          showNotificationBadge
          navigation={navigation}
        />
      ) : null}
      {toBeBought.length ? (
        <HorizontalScroll
          title="Överenskommet - att köpas"
          subTitle="Väntar på att köpas och hämtas av dig på överenskommen tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeBought}
          showNotificationBadge
          navigation={navigation}
        />
      ) : null}
      {toBeSold.length ? (
        <HorizontalScroll
          title="Överenskommet - att säljas"
          subTitle="Väntar på att säljas och lämnas av dig på överenskommen tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeSold}
          showNotificationBadge
          navigation={navigation}
        />
      ) : null}
    </>
  );
};

export default UserActions;
