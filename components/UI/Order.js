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
    reservedUntil,
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

  const orderIsExpired =
    !isCollected &&
    new Date(reservedUntil) instanceof Date &&
    new Date(reservedUntil) <= new Date();

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
                style={{ borderRadius: 3, width: 100, height: 100, resizeMode: 'contain' }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          )}
          <View style={{ paddingLeft: 10, flex: 1 }}>
            <Text>{currentProduct.title}</Text>
            <Text>{quantity} st</Text>

            {!bothHaveAgreedOnTime ? (
              <Text style={styles.statusText}>{`Väntar på att ${
                waitingForYou ? 'du' : nameOfThumberOuterGetter
              } ska godkänna den föreslagna upphämtningstiden`}</Text>
            ) : null}

            {bothHaveAgreedOnTime && !isCollected ? (
              <Text style={styles.statusText}>
                Upphämtningstid överenskommen! Hämtas{' '}
                {moment(suggestedDate).locale('sv').format('D MMM YYYY, HH:mm')}
              </Text>
            ) : null}

            {isCollected ? (
              <Text
                style={[
                  styles.statusText,
                  { fontFamily: 'roboto-bold-italic', color: Colors.subtleGreen },
                ]}>
                {`Hämtad ${moment(isCollected).locale('sv').format('D MMMM YYYY, HH:mm')}`}
              </Text>
            ) : null}
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
            size={16}
            color="#666"
          />
        )}
      </TouchableCmp>

      {showDetails ? (
        <>
          <Divider />

          <View style={{ paddingVertical: 20 }}>
            {!orderIsExpired && !isCollected ? (
              <>
                <StatusText
                  label="Reserverad till:"
                  text={moment(reservedUntil).locale('sv').calendar()}
                />
                {!bothHaveAgreedOnTime ? (
                  <StatusText
                    label="Föreslagen upphämtningstid:"
                    text={
                      suggestedDate
                        ? `${moment(suggestedDate).locale('sv').format('D MMM YYYY, HH:mm')}`
                        : 'Inget tidsförslag angivet'
                    }
                  />
                ) : null}
                {bothHaveAgreedOnTime ? (
                  <StatusText
                    label="Överenskommen upphämtningstid:"
                    text={moment(suggestedDate).locale('sv').format('D MMM YYYY, HH:mm')}
                  />
                ) : null}
                <StatusText
                  textStyle={{ width: 200, textAlign: 'right' }}
                  label="Upphämtningsaddress:"
                  text={currentProduct.address}
                />
                {currentProduct.pickupDetails ? (
                  <StatusText
                    textStyle={{ width: 200, textAlign: 'right' }}
                    label="Detaljer om hämtning:"
                    text={currentProduct.pickupDetails}
                  />
                ) : null}
                {comments ? <Text>Kommentarer: {comments}</Text> : null}
              </>
            ) : null}
            {orderIsExpired ? (
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  margin: 10,
                  fontFamily: 'roboto-light-italic',
                }}>
                Reservationen gick ut $
                {moment(reservedUntil).locale('sv').format('D MMMM YYYY, HH:mm')}. Antingen markera
                som 'hämtad' om den är hämtad, föreslå en ny upphämtningstid, eller avreservera
                beställningen nedan. Notera att både säljaren och köparen kan avreservera när
                reservationen är slut.
              </Text>
            ) : null}
            {isCollected ? (
              <>
                <StatusText
                  label="Datum hämtades"
                  text={moment(isCollected).locale('sv').format('D MMMM YYYY, HH:mm')}
                />

                <View style={styles.oneLineSpread}>
                  <StatusText label="Köpare" style={{ marginLeft: -10 }} />
                  <>
                    <StatusText text={buyerProfile.profileName} />
                    <UserAvatar
                      userId={buyerProfile.profileId}
                      style={{ margin: 0, textAlign: 'right' }}
                      showBadge={false}
                      actionOnPress={() => {
                        navigation.navigate('Användare', {
                          detailId: buyerProfile.profileId,
                        });
                      }}
                    />
                  </>
                </View>
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

          <OrderActions order={order} isBuyer={isBuyer} isSeller={isSeller} />
        </>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.darkPrimary,
    fontFamily: 'roboto-light-italic',
  },
});

export default Order;
