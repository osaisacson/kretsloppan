import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  ActivityIndicator,
  View,
  FlatList,
  Button,
  StyleSheet
} from 'react-native';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import EmptyState from '../../components/UI/EmptyState';

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
        price: state.cart.items[key].price ? state.cart.items[key].price : 0,
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

  const loadedContent =
    cartItems.length === 0 ? (
      <EmptyState>
        Vagnen är tom, hitta redan gjorda bokningar under 'Bokat' i sidomenyn
      </EmptyState>
    ) : (
      <Button
        color={Colors.accent}
        title="Boka"
        disabled={cartItems.length === 0}
        onPress={sendOrderHandler}
      />
    );

  return (
    <View style={styles.screen}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            price={itemData.item.price}
            imageUrl={itemData.item.imageUrl}
            deletable //Makes the delete button visible on the CardItem component
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
      <View style={styles.summary}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          loadedContent
        )}
      </View>
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
    justifyContent: 'center',
    marginTop: 20,
    padding: 10
  },
  summaryText: {
    fontFamily: 'roboto-bold',
    fontSize: 18
  }
});

export default CartScreen;
