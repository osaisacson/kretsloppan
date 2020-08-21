import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import Card from '../../../components/UI/Card';
import SmallRoundItem from '../../../components/UI/SmallRoundItem';
import UserAvatar from '../../../components/UI/UserAvatar';
import Colors from './../../../constants/Colors';

const Orders = ({ selectedProduct, hasEditPermission, loggedInUserId, navigation }) => {
  const { id } = selectedProduct;

  const profiles = useSelector((state) => state.profiles.allProfiles);
  const projects = useSelector((state) => state.projects.availableProjects);
  const orders = useSelector((state) => state.orders.availableOrders);

  const productOrders = orders.find((order) => order.productId === id);
  const userOrders = orders.find((order) => order.buyerId === loggedInUserId);

  let currentOrders = [];

  //If the logged in user is the creator of the product show all the orders for the product
  if (hasEditPermission) {
    currentOrders = productOrders;
  }

  //If the logged in user has any orders of the product, show these
  if (userOrders.length) {
    currentOrders = userOrders;
  }

  const Order = ({ buyerId, projectId, order, navigation }) => {
    const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
    const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

    return (
      <Card>
        <Text>{buyerProfile.profileName}</Text>
        <Text>{buyerProfile.phone ? buyerProfile.phone : 'Ingen telefon angiven'}</Text>
        <Text>{buyerProfile.address ? buyerProfile.address : 'Ingen address angiven'}</Text>
        {order.comments ? <Text>{order.comments}</Text> : null}
        <View style={[styles.textAndBadge, { justifyContent: 'flex-end' }]}>
          <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, right: -10 }]}>
            <Text style={styles.smallText}>köpare</Text>
          </View>
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
      </Card>
    );
  };

  return (
    <View>
      {currentOrders.map((item) => (
        <Order
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Orders;
