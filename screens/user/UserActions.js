import React, { useState } from 'react';
import { View, SectionList, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { Divider } from 'react-native-paper';
import ActionLine from '../../components/UI/ActionLine';
import UserActionItem from '../../components/UI/UserActionItem';
import Colors from '../../constants/Colors';

const UserActions = (props) => {
  const [showUserActions, setShowUserActions] = useState(false);

  const availableProducts = useSelector((state) => state.products.availableProducts);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;
  const userProducts = availableProducts.filter((prod) => prod.ownerId === loggedInUserId);

  const { navigation } = props;

  //Reserved by or from user
  const reservedByOrFromUserRaw = availableProducts.filter(
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
  const toBeBoughtRaw = availableProducts.filter(
    (product) => product.status === 'ordnad' && product.collectingUserId === loggedInUserId
  );
  const toBeBought = toBeBoughtRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  const badgeNr = reservedByOrFromUser.length + toBeBought.length + toBeSold.length;

  const clickItem = (item) => {
    alert(item);
  };

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
          <SectionList
            sections={[
              {
                title: 'Reservationer',
                subTitle: 'Väntar på att ni kommer överens om tid för överlämning',
                data: reservedByOrFromUser,
              },
              {
                title: 'Att köpas',
                subTitle: 'Väntar på att köpas av dig på överenskommen tid',
                data: toBeBought,
              },
              {
                title: 'Att säljas',
                subTitle: 'Väntar på att säljas av dig på överenskommen tid',
                data: toBeSold,
              },
            ]}
            renderSectionHeader={({ section }) => (
              <>
                <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
                  <Text style={{ fontFamily: 'bebas-neue-bold', fontSize: 23, marginTop: 15 }}>
                    {section.title}
                  </Text>
                  <Text style={{ fontFamily: 'roboto-light-italic', fontSize: 15 }}>
                    {section.subTitle}
                  </Text>
                </View>
                <Divider />
              </>
            )}
            renderItem={({ item }) => (
              <>
                <UserActionItem detailPath="ProductDetail" item={item} navigation={navigation} />
                <Divider />
              </>
            )}
            keyExtractor={(item, index) => index}
          />

          {/* {reservedByOrFromUser.length ? (
            <HorizontalScroll
              showStatus
              title="Reservationer"
              subTitle="Väntar på att ni kommer överens om tid för överlämning"
              scrollData={reservedByOrFromUser}
              showNotificationBadge
              navigation={navigation}
            />
          ) : null}
          {toBeBought.length ? (
            <HorizontalScroll
              showStatus
              title="Att köpas"
              subTitle="Väntar på att köpas av dig på överenskommen tid."
              scrollData={toBeBought}
              showNotificationBadge
              navigation={navigation}
            />
          ) : null}
          {toBeSold.length ? (
            <HorizontalScroll
              showStatus
              title="Att säljas"
              subTitle="Väntar på att säljas av dig på överenskommen tid."
              scrollData={toBeSold}
              showNotificationBadge
              navigation={navigation}
            />
          ) : null} */}
        </View>
      ) : null}
    </>
  );
};

export default UserActions;
