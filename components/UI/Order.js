import { AntDesign } from '@expo/vector-icons';
import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

import Card from './Card';
import OrderActions from './OrderActions';
import SmallRoundItem from './SmallRoundItem';
import StatusText from './StatusText';
import TouchableCmp from './TouchableCmp';
import UserAvatar from './UserAvatar';

const Order = ({ order, navigation, profiles, projects, isSeller, isBuyer }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    productId,
    buyerId,
    projectId,
    image,
    quantity,
    reservedUntil,
    comments,
    suggestedDate,
    buyerAgreed,
    sellerAgreed,
  } = order;

  const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
  const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

  const waitingForYouAsSeller = isSeller && !sellerAgreed;
  const waitingForYouAsBuyer = isBuyer && !buyerAgreed;

  const toggleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const goToItem = () => {
    navigation.navigate('ProductDetail', { detailId: productId });
  };

  return (
    <Card>
      <TouchableCmp onPress={toggleShowDetails}>
        <View style={styles.oneLineSpread}>
          {isBuyer ? (
            <TouchableOpacity onPress={goToItem}>
              <Image
                style={{ width: 100, height: 100, resizeMode: 'contain' }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          ) : (
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
          )}
          <View style={{ paddingLeft: 10, flex: 1 }}>
            <Text>{quantity} st</Text>

            {!buyerAgreed || !sellerAgreed ? (
              <Text>{`Väntar på att ${
                waitingForYouAsBuyer || waitingForYouAsSeller ? 'du' : 'säljaren'
              } ska godkänna den föreslagna upphämtningstiden`}</Text>
            ) : (
              <Text>
                Överenskommen upphämtningstid:{' '}
                {moment(suggestedDate).locale('sv').format('DD MMMM YYYY, HH:mm')}
              </Text>
            )}
          </View>
        </View>
        <AntDesign
          style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, marginTop: -20 }}
          name="caretdown"
          size={16}
          color="#666"
        />
      </TouchableCmp>

      {showDetails ? (
        <>
          <Divider />
          {projectForProduct ? (
            <>
              <Text>Till projekt:</Text>
              <SmallRoundItem
                detailPath="ProjectDetail"
                item={projectForProduct}
                navigation={navigation}
              />
            </>
          ) : null}
          <View style={{ paddingVertical: 20 }}>
            <StatusText
              label="Reserverad till:"
              text={moment(reservedUntil).locale('sv').calendar()}
            />
            {!buyerAgreed || !sellerAgreed ? (
              <StatusText
                label="Föreslagen upphämtningstid:"
                text={moment(suggestedDate).locale('sv').format('D MMMM YYYY, HH:mm')}
              />
            ) : null}
            {comments ? <Text>Kommentarer: {comments}</Text> : null}
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
});

export default Order;
