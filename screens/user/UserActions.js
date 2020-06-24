import React, { useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import ActionLine from '../../components/UI/ActionLine';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Colors from '../../constants/Colors';

const UserActions = (props) => {
  const [showUserActions, setShowUserActions] = useState(false);

  const allProducts = useSelector((state) => state.products.availableProducts);
  const userProducts = useSelector((state) => state.products.userProducts);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  const { navigation } = props;

  //Reserved by or from user
  const reservedByOrFromUserRaw = allProducts.filter(
    (product) =>
      product.status === 'reserverad' &&
      (product.reservedUserId === loggedInUserId || product.ownerId === loggedInUserId)
  );
  const reservedByOrFromUser = reservedByOrFromUserRaw.sort(function (a, b) {
    a = new Date(a.reservedDate);
    b = new Date(b.reservedDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //To be sold: Gets all products from the user marked as ready to be collected
  const toBeSoldRaw = userProducts.filter((product) => product.status === 'ordnad');
  const toBeSold = toBeSoldRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //To be bought: Gets all products marked as ready to be collected by the user
  const toBeBoughtRaw = allProducts.filter(
    (product) => product.status === 'ordnad' && product.collectingUserId === loggedInUserId
  );
  const toBeBought = toBeBoughtRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  const badgeNr = reservedByOrFromUser.length + toBeBought.length + toBeSold.length;

  return (
    <>
      {badgeNr ? (
        <ActionLine
          isActive={showUserActions}
          badgeNr={badgeNr}
          onPress={() => {
            setShowUserActions(!showUserActions);
          }}
        />
      ) : null}
      {showUserActions ? (
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
          {reservedByOrFromUser.length ? (
            <HorizontalScroll
              title="Reservationer"
              subTitle="Väntar på att ni kommer överens om tid för överlämning"
              scrollData={reservedByOrFromUser}
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
      ) : null}
    </>
  );
};

export default UserActions;
