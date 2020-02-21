import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

//Components
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button
} from 'react-native';
import UserAvatar from '../../components/UI/UserAvatar';

//Constants
import Colors from '../../constants/Colors';
//Actions
import * as cartActions from '../../store/actions/cart'; //Merges all cartActions defined in the pointed to file into one batch which can be accessed through cartActions.xxx
import * as productsActions from '../../store/actions/products';

const ProductDetailScreen = props => {
  const productId = props.route.params.productId;
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const editProductHandler = id => {
    navigation.navigate('EditProduct', { productId: id });
  };

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.image }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Lägg i korg"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
        <Button
          color={Colors.primary}
          title="Edit"
          onPress={() => {
            editProductHandler(selectedProduct.id);
          }}
        />
        <Button
          color={Colors.primary}
          title="Delete"
          onPress={deleteHandler.bind(this, selectedProduct.id)}
        />
      </View>
      <Text style={styles.description}>
        Ta kontakt med dessa åkare om ni behöver hjälp med transporten:
      </Text>
      <Text style={styles.description}>(lista)</Text>

      <Text style={styles.price}>
        {selectedProduct.price ? selectedProduct.price.toFixed(1) : 0} kr
      </Text>

      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.productTitle,
    headerRight: () => (
      <UserAvatar
        showBadge={true}
        actionOnPress={() => {
          navData.navigation.navigate('Admin');
        }}
      />
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
  price: {
    fontFamily: 'roboto-regular',
    fontSize: 20,
    textAlign: 'right',
    marginHorizontal: 20
  },
  description: {
    fontFamily: 'roboto-regular',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
