import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Alert
} from 'react-native';
import UserAvatar from '../../components/UI/UserAvatar';
import ToggleButton from '../../components/UI/ToggleButton';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductDetailScreen = props => {
  const productId = props.route.params.productId;
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  const [isToggled, setIsToggled] = useState(false);

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
  var firstDay = new Date();
  const oneWeekFromNow = new Date(
    firstDay.getTime() + 7 * 24 * 60 * 60 * 1000
  ).toDateString();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.image }} />
      <View style={styles.actions}>
        <ToggleButton
          color={isToggled ? '#666' : '#000'}
          title={
            selectedProduct.status === 'reserverad'
              ? `reserverad till ${
                  selectedProduct.reservedUntil
                    ? selectedProduct.reservedUntil
                    : '000'
                }`
              : 'reservera'
          }
          onSelect={() => {
            setIsToggled(prevState => !prevState);
            let status = isToggled ? 'reserverad' : 'redo';
            dispatch(
              productsActions.changeProductStatus(selectedProduct.id, status)
            );
            navigation.navigate('ProductsOverview');
          }}
        />
        <Text>{selectedProduct.status}</Text>
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
