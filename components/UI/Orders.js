import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Order from './Order';

const Orders = ({ orders, navigation, loggedInUserId, isProductDetail }) => {
  const products = useSelector((state) => state.products.availableProducts);
  const projects = useSelector((state) => state.projects.availableProjects);
  const profiles = useSelector((state) => state.profiles.allProfiles);
  if (!orders) {
    console.log('No orders to show');
    return null;
  }

  return (
    <View>
      {orders.map((item) => (
        <Order
          key={item.id}
          order={item}
          navigation={navigation}
          loggedInUserId={loggedInUserId}
          isProductDetail={isProductDetail}
          projects={projects}
          products={products}
          profiles={profiles}
        />
      ))}
    </View>
  );
};

export default Orders;
