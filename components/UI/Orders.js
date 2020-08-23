import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import Order from './Order';

const Orders = ({ isSeller, isBuyer, orders, navigation }) => {
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
          isSeller={isSeller}
          isBuyer={isBuyer}
          profiles={profiles}
          projects={projects}
        />
      ))}
    </View>
  );
};

export default Orders;
