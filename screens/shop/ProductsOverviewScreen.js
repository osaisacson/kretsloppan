import React from 'react';
import { FlatList, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart'; //Merges all cartActions defined in the pointed to file into one batch which can be accessed through cartActions.xxx
import HeaderButton from '../../components/UI/HeaderButton';

const ProductsOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts); //Get a slice of the state, in particular the available producst from the products
  const dispatch = useDispatch(); //make onDispacth available for the buttons
  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id} //Newer versions of React Native don't need this line, the key gets auto extracted from the id
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetail={() => {
            props.navigation.navigate('ProductDetail', {
              productId: itemData.item.id, //Passes the id of the item through the navigator. Can be extracted in the following screen through props.navigation.getParam('productId')
              productTitle: itemData.item.title
            });
          }}
          onAddToCart={() => {
            dispatch(cartActions.addToCart(itemData.item)); //Passes the whole object to actions/cart.js
          }}
        />
      )} //For each item output a jsx element with the data of that item
    />
  );
};

//Overrides the default title being set in the ShopNavigator defaultNavigationOptions
ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer(); //Navigate nowhere, just open the sidedrawer
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart'); //Go to cart on clicking the cart button
          }}
        />
      </HeaderButtons>
    )
  };
};

export default ProductsOverviewScreen;
