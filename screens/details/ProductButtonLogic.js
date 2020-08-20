import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import AnimatedButton from '../../components/UI/AnimatedButton';
import HeaderThree from '../../components/UI/HeaderThree';
import Loader from '../../components/UI/Loader';
import ProductStatusCopy from '../../components/UI/ProductStatusCopy';
import Colors from '../../constants/Colors';
import ProductDetailHeader from './ProductDetailHeader';

const ProductButtonLogic = (props) => {
  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Set up state hooks
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const {
    id,
    amount,
    projectId,
    status,
    ownerId,
    reservedUserId,
    collectingUserId,
    newOwnerId,
    suggestedDate,
    collectingDate,
    phone,
    address,
    sellerAgreed,
    buyerAgreed,
    pickupDetails,
  } = props.selectedProduct;

  if (showButtons && !suggestedDate) {
    buttonCopy = 'Föreslå en tid';
  }

  if (showButtons && collectingDate) {
    buttonCopy = 'Se detaljer eller markera som hämtad';
  }

  if (suggestedDate && !sellerAgreed && hasEditPermission) {
    buttonCopy = 'Godkänn/ändra tid';
  }

  ///////////////////////////////START TBD: REMOVE THIS WHEN WE HAVE MIGRATED TO ORDERS INSTEAD OF PRODUCTS
  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const hasEditPermission = props.hasEditPermission;
  const isSellerOrBuyer = hasEditPermission || isReservedUser || isOrganisedUser;
  const showButtons = isSellerOrBuyer && (isReserved || isOrganised);

  //Will change based on where we are in the reservation process
  let receivingId = '';
  let buttonCopy = 'Se upphämtningsdetaljer';

  if (isReserved) {
    receivingId = reservedUserId;
  }

  if (isOrganised) {
    receivingId = collectingUserId;
  }

  if (isPickedUp) {
    receivingId = newOwnerId;
  }

  /////////////////////////////// END

  //Avatar logic
  const profiles = useSelector((state) => state.profiles.allProfiles);

  const ownerProfile = profiles.find((profile) => profile.profileId === ownerId);

  const receivingProfile = profiles.find((profile) => profile.profileId === receivingId);

  const toggleShowOptions = () => {
    setShowOptions((prevState) => !prevState);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <ProductDetailHeader
        navigation={props.navigation}
        hasEditPermission={props.hasEditPermission}
        selectedProduct={props.selectedProduct}
      />
      <View
        style={{
          backgroundColor: Colors.lightPrimary,
          borderWidth: 0.5,
          borderColor: '#000',
          borderRadius: 5,
          padding: 5,
        }}>
        <View>
          <ProductStatusCopy
            style={{ textAlign: 'center' }}
            selectedProduct={props.selectedProduct}
          />
          {!isPickedUp ? <AnimatedButton onPress={toggleShowOptions} text={buttonCopy} /> : null}
        </View>

        {/* Details about the item, and options for the logistics */}
        {showOptions ? (
          <>
            <Divider style={{ marginBottom: 10 }} />
            <View style={styles.oneLineSpread}>
              <View style={styles.ownerOptions}>
                <Text>{ownerProfile.profileName}</Text>
                <Text>{phone ? `0${phone}` : 'Ingen telefon angiven'}</Text>
                {address ? <Text>{address ? address : 'Ingen address angiven'}</Text> : null}
                {pickupDetails ? (
                  <View style={styles.pickupDetails}>
                    <HeaderThree text="Upphämtningsdetaljer: " />
                    <Text>{pickupDetails}</Text>
                  </View>
                ) : null}
              </View>

              {receivingProfile ? (
                <View style={styles.receivingOptions}>
                  <Text>{receivingProfile.profileName}</Text>
                  <Text>
                    {receivingProfile.phone ? receivingProfile.phone : 'Ingen telefon angiven'}
                  </Text>
                  {receivingProfile.address ? (
                    <Text style={{ textAlign: 'right' }}>
                      {receivingProfile.address
                        ? receivingProfile.address
                        : 'Ingen address angiven'}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          </>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerOptions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  pickupDetails: {
    paddingVertical: 8,
  },
  receivingOptions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingBottom: 5,
  },
  oneLineRight: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'right',
    right: 0,
  },
  leftTextAndBadge: {
    marginLeft: -10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textAndBadge: {
    flex: 1,
    flexDirection: 'row',
  },
  smallBadge: {
    zIndex: 10,
    paddingHorizontal: 2,
    borderRadius: 5,
    height: 17,
  },
  smallText: {
    textTransform: 'uppercase',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  box: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  boxText: {
    fontFamily: 'roboto-bold',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default ProductButtonLogic;
