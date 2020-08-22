import moment from 'moment/min/moment-with-locales';
import React from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as ordersActions from '../../store/actions/orders';
import Colors from './../../constants/Colors';
import ButtonIcon from './ButtonIcon';
import Card from './Card';
import ProductStatusCopy from './ProductStatusCopy';
import SmallRoundItem from './SmallRoundItem';
import UserAvatar from './UserAvatar';

const Orders = ({ isSeller, isBuyer, orders, navigation }) => {
  const profiles = useSelector((state) => state.profiles.allProfiles);
  const projects = useSelector((state) => state.projects.availableProjects);

  if (!orders) {
    return null;
  }

  console.log('orders', orders);

  const Order = ({ buyerId, projectId, order, navigation }) => {
    const dispatch = useDispatch();

    const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
    const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

    const deleteHandler = () => {
      Alert.alert(
        'Är du säker?',
        'Vill du verkligen radera den här reservationen? Det går inte att gå ändra sig när det väl är gjort.',
        [
          { text: 'Nej', style: 'default' },
          {
            text: 'Ja, radera',
            style: 'destructive',
            onPress: () => {
              // navigation.goBack();
              dispatch(ordersActions.deleteOrder(order.id));
            },
          },
        ]
      );
    };

    return (
      <Card style={styles.oneLineSpread}>
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

        <View style={[styles.textAndBadge, { justifyContent: 'flex-end' }]}>
          {projectForProduct ? (
            <>
              <View style={{ marginLeft: -20, zIndex: -1 }}>
                <SmallRoundItem
                  detailPath="ProjectDetail"
                  item={projectForProduct}
                  navigation={navigation}
                />
              </View>
            </>
          ) : null}
        </View>

        <View style={{ paddingLeft: 10, width: 330 }}>
          <Text>{order.quantity} st</Text>

          <Text>Reserverad tills {moment(order.reservedUntil).locale('sv').calendar()}</Text>

          <Text>{`Väntar på att ${
            !order.buyerAgreed ? 'köparen' : 'säljaren'
          } ska godkänna den föreslagna tiden`}</Text>

          <ProductStatusCopy style={{ textAlign: 'left' }} selectedProduct={order} />
          {order.comments ? <Text>Kommentarer: {order.comments}</Text> : null}
        </View>
        <View>
          <ButtonIcon
            icon="delete"
            color={Colors.warning}
            onSelect={() => {
              deleteHandler(order.id);
            }}
          />
        </View>
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
