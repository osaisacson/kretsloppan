import React from 'react';
import { FlatList, Button, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart'; //Merges all cartActions defined in the pointed to file into one batch which can be accessed through cartActions.xxx
import HeaderButton from '../../components/UI/HeaderButton';
import EmptyState from '../../components/UI/EmptyState';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const productsOriginal = useSelector(
    state => state.products.availableProducts
  ); //Get a slice of the state, in particular the available products from the products
  const categoryName = props.navigation.getParam('categoryName');
  const products = productsOriginal.filter(
    prod => prod.categoryName === categoryName
  );

  const dispatch = useDispatch(); //make onDispatch available for the buttons

  const selectItemHandler = (id, title) => {
    //Passes the data of the item through the navigator.
    // Can be extracted in the following screen through eg props.navigation.getParam('productId')
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  if (products.length === 0 || !products) {
    return <EmptyState>Det finns inget i den här kategorin ännu.</EmptyState>;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id} //Newer versions of React Native don't need this line, the key gets auto extracted from the id
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title); //Pass data to the next screen
          }}
        >
          {/* These buttons will be rendered due to the props.children in
          ProductItem. We are passing them within the ProductItem component (ie,
          it's children) */}
          <Button
            color={Colors.primary}
            title="Se mer"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title); //Pass data to the next screen
            }}
          />
          <Button
            color={Colors.primary}
            title="Lägg i korg"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item)); //Passes the whole object to actions/cart.js
            }}
          />
        </ProductItem>
      )} //For each item output a jsx element with the data of that item
    />
  );
};

//Overrides the default title being set in the ShopNavigator defaultNavigationOptions
ProductsOverviewScreen.navigationOptions = navData => {
  const categoryName = navData.navigation.getParam('categoryName');

  return {
    headerTitle: categoryName,
    // headerLeft: (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       title="Menu"
    //       iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
    //       onPress={() => {
    //         navData.navigation.toggleDrawer(); //Navigate nowhere, just open the sidedrawer
    //       }}
    //     />
    //   </HeaderButtons>
    // ),
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
