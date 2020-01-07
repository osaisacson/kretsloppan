import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';

import * as cartActions from '../../store/actions/cart'; //Lets us access all actions through cartActions.xxxx
import * as orderActions from '../../store/actions/orders';

const CartScreen = props => {
  const cartTotalAmount = useSelector(state => state.cart.totalAmount); //Get slice of state from redux, comes from the reducers/cart.js
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    //Creating a new card item by looping over all the cart item objects and adding each of them as an item to the array of transformedCartItems
    //This to make cartItems into an array which makes it easier for us to work with in the UI. For example loop over in FlatList or disabling buttons.
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch(); //get access to dispatching actions below.

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text style={styles.amount}>
            {(Math.round(cartTotalAmount.toFixed(2)) * 100) / 100} Kr{' '}
            {/* Math to ensure we never end up with minus values */}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title="Order Now"
          disabled={cartItems.length === 0}
          onPress={() => {
            dispatch(orderActions.addOrder(cartItems, cartTotalAmount)); //Moves tha items to the orders and clears the cart. See logic in orderreducer.
          }}
        />
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable //Makes the delete button visible on the CardItem component
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.primary
  }
});

export default CartScreen;
