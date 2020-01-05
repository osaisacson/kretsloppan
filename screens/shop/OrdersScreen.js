import React from 'react';
import { FlatList, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

const OrdersScreen = props => {
  const orders = useSelector(state => state.orders.orders); //This identifies the state from 1. 'orders' in APP.js. From there we get access to the state from 2. the 'orders' reducer defined in './store/reducers/orders'.

  return (
    <FlatList
      data={orders} //Flatlist should take an array
      keyExtractor={item => item.id} // Usually not needed in new versions, only needed if don't have an id
      renderItem={itemData => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items} //pass the items which will later be looped over
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer(); //Open the sidedrawer
          }}
        />
      </HeaderButtons>
    )
  };
};

export default OrdersScreen;
