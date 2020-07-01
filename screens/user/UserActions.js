import React, { useState } from 'react';
import { View, SectionList, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ActionLine from '../../components/UI/ActionLine';
import UserActionItem from '../../components/UI/UserActionItem';
import Colors from '../../constants/Colors';

const UserActions = (props) => {
  const [showUserActions, setShowUserActions] = useState(props.falseAtStart);

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
        <SectionList
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{
            position: 'absolute',
            top: 50,
            zIndex: 100,
            height: '100%',
            width: '100%',
            backgroundColor: Colors.lightPrimary,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 2,
          }}
          sections={[
            {
              title: 'Reservationer',
              data: reservedByOrFromUser,
            },
            {
              title: 'Att köpas',
              data: toBeBought,
            },
            {
              title: 'Att säljas',
              data: toBeSold,
            },
          ]}
          renderSectionHeader={({ section }) =>
            section.data.length ? (
              <>
                <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
                  <Text style={{ fontFamily: 'bebas-neue-bold', fontSize: 23, marginTop: 15 }}>
                    {section.title}
                  </Text>
                </View>
                <Divider />
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <>
              <UserActionItem detailPath="ProductDetail" item={item} navigation={navigation} />
              <Divider />
            </>
          )}
          keyExtractor={(item, index) => index}
        />
      ) : null}
    </>
  );
};

export default UserActions;
