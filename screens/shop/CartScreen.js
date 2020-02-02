import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  ActivityIndicator,
  View,
  Text,
  FlatList,
  Button,
  StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
//Actions
import * as cartActions from '../../store/actions/cart'; //Lets us access all actions through cartActions.xxxx
import * as orderActions from '../../store/actions/orders';

const CartScreen = props => {
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    //Creating a new card item by looping over all the cart item objects and adding each of them as an item to the array of transformedCartItems
    //This to make cartItems into an array which makes it easier for us to work with in the UI. For example loop over in FlatList or disabling buttons.
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        imageUrl: state.cart.items[key].imageUrl,
        quantity: state.cart.items[key].quantity,
        productTitle: state.cart.items[key].productTitle
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const dispatch = useDispatch(); //get access to dispatching actions below.

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(orderActions.addOrder(cartItems)); //Moves tha items to the orders and clears the cart. See logic in orderreducer.
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Boka"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            imageUrl={itemData.item.imageUrl}
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
  }
});

export default CartScreen;
