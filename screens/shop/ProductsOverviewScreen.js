import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  StyleSheet
  // TouchableOpacity
} from 'react-native';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
// import { Ionicons } from '@expo/vector-icons';
import AddButton from '../../components/UI/AddButton';
import ContentHeader from '../../components/UI/ContentHeader';
import Loader from '../../components/UI/Loader';
import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
//Actions
// import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [isClicked, setIsClicked] = useState(false);

  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  // const products = unsortedProducts.slice().sort((a, b) => a.date - b.date);

  //Function that adds the diff method to the array prototype.
  Array.prototype.diff = function(a) {
    return this.filter(function(i) {
      return a.indexOf(i) < 0;
    });
  };
  const recentProductsUnsorted = products.slice(
    Math.max(products.length - 5, 0)
  ); //Gets last 5 items uploaded

  const productsExceptNewestUnsorted = products.diff(recentProductsUnsorted); //Pass the array we want to exclude from the array

  const recentProducts = recentProductsUnsorted.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const productsExceptNewest = productsExceptNewestUnsorted.sort(function(
    a,
    b
  ) {
    return new Date(b.date) - new Date(a.date);
  });

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadProducts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      <HorizontalScroll
        title={'Nya Tillskott'}
        subTitle={'Det fräschaste, det nyaste'}
        scrollData={recentProducts}
      />
      <ContentHeader
        title={'Aktivt Förråd'}
        subTitle={'Allt som är redo att hämtas'}
        indicator={
          productsExceptNewest.length ? productsExceptNewest.length : 0
        }
      />
      <FlatList
        horizontal={false}
        numColumns={2}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={productsExceptNewest}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price ? itemData.item.price : 0}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            {/* <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={25}
              // color={isClicked ? Colors.primary : 'grey'} //NOTE: make so responds to if added/deleted from korg
              color={'grey'}
              onPress={() => {
                // setIsClicked(true);
                dispatch(cartActions.addToCart(itemData.item));
              }}
            />
            <Ionicons
              name={
                Platform.OS === 'android'
                  ? 'md-arrow-dropright-circle'
                  : 'ios-arrow-dropright-circle'
              }
              size={25}
              color={Colors.primary}
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
            /> */}
          </ProductItem>
        )}
      />
      <AddButton />
    </View>
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Återbruk',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
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
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    width: '100%'
  },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductsOverviewScreen;
