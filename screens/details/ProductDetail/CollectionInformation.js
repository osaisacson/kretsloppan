import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import AnimatedButton from '../../../components/UI/AnimatedButton';
import HeaderThree from '../../../components/UI/HeaderThree';
import ProductStatusCopy from '../../../components/UI/ProductStatusCopy';
import Colors from '../../../constants/Colors';

const CollectionInformation = ({ selectedProduct }) => {
  //Set up state hooks
  const [showOptions, setShowOptions] = useState(false);

  const { ownerId, phone, address, pickupDetails } = selectedProduct;

  const profiles = useSelector((state) => state.profiles.allProfiles);

  const ownerProfile = profiles.find((profile) => profile.profileId === ownerId);

  const toggleShowOptions = () => {
    setShowOptions((prevState) => !prevState);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: Colors.lightPrimary,
          borderWidth: 0.5,
          borderColor: '#000',
          borderRadius: 5,
          padding: 5,
        }}>
        <View>
          <ProductStatusCopy style={{ textAlign: 'center' }} selectedProduct={selectedProduct} />
          <AnimatedButton onPress={toggleShowOptions} text="Se upphämtningsdetaljer" />
        </View>

        {/* Details about collecting the item */}
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
  textAndBadge: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default CollectionInformation;
