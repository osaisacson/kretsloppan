import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';

const ProductsOverviewScreen = props => {
  const products = useSelector(state => state.products.availableProducts); //Get a slice of the state, in particular the available producst from the products
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
          onAddToCart={() => {}}
        />
      )} //For each item output a jsx element with the data of that item
    />
  );
};

//Overrides the default title being set in the ShopNavigator defaultNavigationOptions
ProductsOverviewScreen.navigationOptions = {
  headerTitle: 'All Products'
};

export default ProductsOverviewScreen;
