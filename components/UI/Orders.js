import moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

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
    const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
    const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

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
