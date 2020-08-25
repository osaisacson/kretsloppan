import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Order from './Order';

const Orders = ({ orders, navigation, loggedInUserId, isProductDetail }) => {
  const profiles = useSelector((state) => state.profiles.allProfiles);
  const projects = useSelector((state) => state.projects.availableProjects);

  if (!orders) {
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
          profiles={profiles}
          projects={projects}
          isProductDetail={isProductDetail}
        />
      ))}
    </View>
  );
};

export default Orders;
