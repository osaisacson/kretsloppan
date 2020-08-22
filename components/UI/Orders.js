import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as ordersActions from '../../store/actions/orders';
import * as productsActions from '../../store/actions/products';
import Colors from './../../constants/Colors';
import ButtonIcon from './ButtonIcon';
import Card from './Card';
import SmallRoundItem from './SmallRoundItem';
import TouchableCmp from './TouchableCmp';
import UserAvatar from './UserAvatar';

const Orders = ({ isSeller, isBuyer, orders, navigation }) => {
  const profiles = useSelector((state) => state.profiles.allProfiles);
  const projects = useSelector((state) => state.projects.availableProjects);

  if (!orders) {
    return null;
  }

  if (isSeller) {
    console.log('sellerOrders', orders);
  }

  if (isBuyer) {
    console.log('buyerOrders', orders);
  }

  const Order = ({ buyerId, projectId, order, navigation }) => {
    const [showDetails, setShowDetails] = useState(false);

    const dispatch = useDispatch();

    const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
    const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};
    const products = useSelector((state) => state.products.availableProducts);
    const currentProduct = products.find((prod) => prod.id === order.id);

    const toggleShowDetails = () => {
      setShowDetails((prevState) => !prevState);
    };

    const deleteHandler = (orderId, orderQuantity) => {
      const updatedProductAmount = Number(currentProduct.amount) + Number(orderQuantity);
      console.log('amount to update product to, after deleting order: ', updatedProductAmount);
      Alert.alert(
        'Är du säker?',
        'Vill du verkligen radera den här reservationen? Det går inte att gå ändra sig när det väl är gjort.',
        [
          { text: 'Nej', style: 'default' },
          {
            text: 'Ja, radera',
            style: 'destructive',
            onPress: () => {
              dispatch(ordersActions.deleteOrder(orderId));
              // dispatch(productsActions.updateProductAmount(orderId, updatedProductAmount));
            },
          },
        ]
      );
    };

    return (
      <Card>
        <TouchableCmp onPress={toggleShowDetails}>
          <View style={styles.oneLineSpread}>
            {isBuyer ? (
              <Image
                style={{ width: 100, height: 100, resizeMode: 'contain' }}
                source={{ uri: order.image }}
              />
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
              <Text>{order.quantity} st</Text>

              <Text>Reserverad tills {moment(order.reservedUntil).locale('sv').calendar()}</Text>

              <Text>{`Väntar på att ${
                !order.buyerAgreed ? 'köparen' : 'säljaren'
              } ska godkänna den föreslagna tiden`}</Text>
            </View>
          </View>
        </TouchableCmp>

        {showDetails ? (
          <>
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
            {order.comments ? <Text>Kommentarer: {order.comments}</Text> : null}
            <ButtonIcon
              icon="delete"
              color={Colors.warning}
              onSelect={() => {
                deleteHandler(order.id, order.quantity);
              }}
            />
          </>
        ) : null}
      </Card>
    );
  };

  return (
    <View>
      {orders.map((item) => (
        <Order
          key={item.id}
          order={item}
          buyerId={item.buyerId}
          projectId={item.projectId}
          navigation={navigation}
        />
      ))}
    </View>
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

export default Orders;
