import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button
} from 'react-native';
import { useSelector } from 'react-redux';

import Colors from '../../constants/Colors';

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam('productId');
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  return (
    <View>
      <Text>{selectedProduct.title}</Text>
    </View>
  );
};

//Overrides the default navigation options in the ShopNavigator
ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle')
  };
};

const styles = StyleSheet.create({});

export default ProductDetailScreen;
