import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  FlatList,
  Button,
  Platform,
  View,
  StyleSheet,
  Text
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Loader from '../../components/UI/Loader';
import EmptyState from '../../components/UI/EmptyState';
import OrderItem from '../../components/shop/OrderItem';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as ordersActions from '../../store/actions/orders';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const orders = useSelector(state => state.orders.orders); //This identifies the state from 1. 'orders' in APP.js. From there we get access to the state from 2. the 'orders' reducer defined in './store/reducers/orders'.
  const dispatch = useDispatch();

  //Runs whenever the component is loaded, and fetches the latest orders
  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(ordersActions.fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  //Update the menu when there's new data: when the screen focuses (see docs for other options, like onBlur), call loadOrders again
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'willFocus',
      loadOrders
    );
    //Cleanup afterwards. Removes the subscription
    return () => {
      willFocusSubscription.remove();
    };
  }, [loadOrders]);

  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]);

  //Om något gick fel, visa ett error message
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Oj oj oj oj oj, något gick fel.</Text>
        <Button
          title="Försök igen"
          onPress={loadOrders}
          color={Colors.primary}
        />
      </View>
    );
  }

  //Om vi inte har några produkter än: visa ett empty state
  if (!isLoading && (orders.length === 0 || !orders)) {
    return <EmptyState>Du har inte bokat något ännu.</EmptyState>;
  }

  //Vissa en spinner när vi laddar produkter
  if (isLoading) {
    return <Loader />;
  }

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
    headerTitle: 'Ditt bokade material',
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

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default OrdersScreen;
