import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button
} from 'react-native';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as cartActions from '../../store/actions/cart'; //Merges all cartActions defined in the pointed to file into one batch which can be accessed through cartActions.xxx

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam('productId');
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Lägg i korg"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%'
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
