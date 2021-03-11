import { AntDesign } from '@expo/vector-icons';
import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Colors from './../../constants/Colors';
import Card from './Card';
import OrderActions from './OrderActions';
import SmallRectangularItem from './SmallRectangularItem';
import StatusText from './StatusText';
import TouchableCmp from './TouchableCmp';
import UserAvatar from './UserAvatar';

const Order = ({ order, navigation, profiles, projects, loggedInUserId, isProductDetail }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    productId,
    buyerId,
    sellerId,
    projectId,
    image,
    quantity,
    comments,
    suggestedDate,
    isCollected,
    buyerAgreed,
    sellerAgreed,
  } = order;

  const products = useSelector((state) => state.products.availableProducts);
  const currentProduct = products.find((product) => product.id === productId);

  const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
  const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

  const theOneWeAreWaitingFor = profiles.find(
    (profile) => profile.profileId === (!sellerAgreed ? sellerId : buyerId)
  );

  const isBuyer = buyerId === loggedInUserId; //The currently logged in user matches the buyerId in the order
  const isSeller = sellerId === loggedInUserId; //The currently logged in user matches the sellerId in the order

  const waitingForYouAsSeller = isSeller && !sellerAgreed;
  const waitingForYouAsBuyer = isBuyer && !buyerAgreed;
  const waitingForYou = waitingForYouAsSeller || waitingForYouAsBuyer;
  const nameOfThumberOuterGetter = theOneWeAreWaitingFor.profileName;

  const bothHaveAgreedOnTime = buyerAgreed && sellerAgreed && suggestedDate;

  const toggleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const goToItem = () => {
    navigation.navigate('ProductDetail', { detailId: productId });
  };

  return (
    <Card style={{ marginTop: 4 }}>
      <TouchableCmp onPress={toggleShowDetails}>
        <View style={styles.oneLineSpread}>
          <Text style={{ fontSize: 18, fontFamily: 'roboto-bold' }}>{currentProduct.title}</Text>
          <Text style={{ fontSize: 16, fontFamily: 'roboto-bold' }}>{quantity} st</Text>
        </View>
        <Divider />

        {/* Image, buttonlogic and buyershortcut */}
        <View style={styles.oneLineSpread}>
          {isProductDetail ? (
            <UserAvatar
              userId={buyerProfile.profileId}
              style={{ margin: 0 }}
              showBadge={false}
              actionOnPress={() => {
                navigation.navigate('Användare', {
                  detailId: buyerProfile.profileId,
                });
              }}
            />
          ) : (
            <TouchableOpacity onPress={goToItem}>
              <Image
                style={{
                  borderRadius: 5,
                  width: 140,
                  height: 140,
                  resizeMode: 'contain',
                }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          )}

          <OrderActions
            order={order}
            loggedInUserId={loggedInUserId}
            isBuyer={isBuyer}
            isSeller={isSeller}
          />
          {/* Large user avatar of the buyer */}
          <View style={styles.textAndBadge}>
            <UserAvatar
              userId={buyerId}
              size={70}
              style={{ margin: 0 }}
              showBadge={false}
              actionOnPress={() => {
                navigation.navigate('Användare', {
                  detailId: buyerId,
                });
              }}
            />
            <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -60 }]}>
              <Text style={styles.smallText}>köpare</Text>
            </View>
          </View>
        </View>
        {isCollected ? (
          <AntDesign
            style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, marginTop: -20 }}
            name="checkcircle"
            size={20}
            color={Colors.subtleGreen}
          />
        ) : (
          <AntDesign
            style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, marginTop: -20 }}
            name="caretdown"
            size={18}
            color="#666"
          />
        )}
      </TouchableCmp>

      {showDetails ? (
        <>
          <Divider />

          <View style={{ paddingVertical: 20 }}>
            <>
              <StatusText
                textStyle={{ width: 200, textAlign: 'right' }}
                label="Upphämtningsaddress:"
                text={currentProduct.address}
              />
              <Divider />
              {currentProduct.pickupDetails ? (
                <>
                  <StatusText
                    textStyle={{ width: 200, textAlign: 'right' }}
                    label="Detaljer om hämtning:"
                    text={currentProduct.pickupDetails}
                  />
                  <Divider />
                </>
              ) : null}
              {currentProduct.phone ? (
                <>
                  <StatusText
                    textStyle={{ width: 200, textAlign: 'right' }}
                    label="Säljarens telefon:"
                    text={currentProduct.phone}
                  />
                  <Divider />
                </>
              ) : null}
              {comments ? <Text>Kommentarer: {comments}</Text> : null}
            </>

            {!isCollected && suggestedDate ? (
              <>
                {!isCollected ? (
                  <StatusText
                    textStyle={{ textAlign: 'right' }}
                    label={!bothHaveAgreedOnTime ? 'Föreslagen upphämtningstid' : 'Hämtas'}
                    text={moment(suggestedDate).locale('sv').format('HH:mm, D MMMM YYYY')}
                  />
                ) : (
                  <StatusText
                    textStyle={{ textAlign: 'right' }}
                    label="Hämtades"
                    text={moment(isCollected).locale('sv').format('HH:mm, D MMMM YYYY')}
                  />
                )}
                <Divider />
              </>
            ) : null}

            {projectForProduct && !projectForProduct === '000' ? (
              <View style={styles.oneLineSpread}>
                <Text style={{ fontFamily: 'roboto-light-italic', marginLeft: 8 }}>
                  Att användas i projekt:
                </Text>
                <View>
                  <SmallRectangularItem
                    detailPath="ProjectDetail"
                    item={projectForProduct}
                    navigation={navigation}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  statusText: {
    color: Colors.darkPrimary,
    fontFamily: 'roboto-light-italic',
  },
  textAndBadge: {
    marginLeft: 30,
    marginBottom: 20,
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
});

export default Order;
