import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import Loader from '../../components/UI/Loader';
import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
//Actions
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [isClicked, setIsClicked] = useState(false);

  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
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
      <FlatList
        horizontal={false}
        numColumns={2}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
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
            <Ionicons
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
            />
          </ProductItem>
        )}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductsOverviewScreen;

// import React, { useState, useEffect, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// //Components
// import { FlatList, Button, Platform } from 'react-native';
// import { HeaderButtons, Item } from 'react-navigation-header-buttons';
// import ProductItem from '../../components/shop/ProductItem';
// import HeaderButton from '../../components/UI/HeaderButton';
// import EmptyState from '../../components/UI/EmptyState';
// import Error from '../../components/UI/Error';
// import Loader from '../../components/UI/Loader';
// //Actions
// import * as cartActions from '../../store/actions/cart'; //Merges all cartActions defined in the pointed to file into one batch which can be accessed through cartActions.xxx
// import * as productsActions from '../../store/actions/products';
// //Constants
// import Colors from '../../constants/Colors';

// const ProductsOverviewScreen = props => {
//   //Set original states
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState();

//   //Get a slice of the state, in particular the available products from the products
//   const productsOriginal = useSelector(
//     state => state.products.availableProducts
//   );

//   //filter products by categoryName, which is set in the parent CategoriesScreen and passed through navigation params
//   const categoryName = props.navigation.getParam('categoryName').toLowerCase();

//   const products = productsOriginal.filter(
//     prod => prod.categoryName.toLowerCase() === categoryName.toLowerCase()
//   );

//   const dispatch = useDispatch(); //make onDispatch available for the buttons

//   //Runs whenever the component is loaded, and fetches the latest products
//   const loadProducts = useCallback(async () => {
//     setError(null);
//     setIsRefreshing(true);
//     try {
//       await dispatch(productsActions.fetchProducts());
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsRefreshing(false);
//   }, [dispatch, setIsLoading, setError]);

//   //Update the menu when there's new data: when the screen focuses (see docs for other options, like onBlur), call loadProducts again
//   useEffect(() => {
//     const willFocusSubscription = props.navigation.addListener(
//       'willFocus',
//       loadProducts
//     );
//     //Cleanup afterwards. Removes the subscription
//     return () => {
//       willFocusSubscription.remove();
//     };
//   }, [loadProducts]);

//   useEffect(() => {
//     setIsLoading(true);
//     loadProducts().then(() => {
//       setIsLoading(false);
//     });
//   }, [dispatch, loadProducts]);

//   const selectItemHandler = (id, title) => {
//     //Passes the data of the item through the navigator.
//     // Can be extracted in the following screen through eg props.navigation.getParam('productId')
//     props.navigation.navigate('ProductDetail', {
//       productId: id,
//       productTitle: title
//     });
//   };

//   //Om något gick fel, visa ett error message
//   if (error) {
//     return <Error actionOnPress={loadProducts} />;
//   }

//   //Om vi inte har något i den valda kategorin: visa ett empty state
//   if (products.length === 0 || !products) {
//     return <EmptyState>Inga material i den här kategorin än</EmptyState>;
//   }

//   //Vissa en spinner när vi laddar produkterna i kategorin
//   if (isLoading) {
//     return <Loader />;
//   }

//   if (!isLoading && products.length === 0) {
//     return <EmptyState>Det finns inget i den här kategorin ännu.</EmptyState>;
//   }

//   return (
//     <FlatList
//       onRefresh={loadProducts}
//       refreshing={isRefreshing}
//       data={products}
//       keyExtractor={item => item.id} //Newer versions of React Native don't need this line, the key gets auto extracted from the id
//       renderItem={itemData => (
//         <ProductItem
//           image={itemData.item.imageUrl}
//           title={itemData.item.title}
//           price={itemData.item.price}
//           onSelect={() => {
//             selectItemHandler(itemData.item.id, itemData.item.title); //Pass data to the next screen
//           }}
//         >
//           {/* These buttons will be rendered due to the props.children in
//           ProductItem. We are passing them within the ProductItem component (ie,
//           it's children) */}
//           <Button
//             color={Colors.primary}
//             title="Se mer"
//             onPress={() => {
//               selectItemHandler(itemData.item.id, itemData.item.title); //Pass data to the next screen
//             }}
//           />
//           <Button
//             color={Colors.primary}
//             title="Lägg i korg"
//             onPress={() => {
//               dispatch(cartActions.addToCart(itemData.item)); //Passes the whole object to actions/cart.js
//             }}
//           />
//         </ProductItem>
//       )} //For each item output a jsx element with the data of that item
//     />
//   );
// };

// //Overrides the default title being set in the ShopNavigator defaultNavigationOptions
// ProductsOverviewScreen.navigationOptions = navData => {
//   const categoryName = navData.navigation.getParam('categoryName');

//   return {
//     headerTitle: categoryName,
//     // headerLeft: (
//     //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
//     //     <Item
//     //       title="Menu"
//     //       iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
//     //       onPress={() => {
//     //         navData.navigation.toggleDrawer(); //Navigate nowhere, just open the sidedrawer
//     //       }}
//     //     />
//     //   </HeaderButtons>
//     // ),
//     headerRight: (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Cart"
//           iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//           onPress={() => {
//             navData.navigation.navigate('Cart'); //Go to cart on clicking the cart button
//           }}
//         />
//       </HeaderButtons>
//     )
//   };
// };

// export default ProductsOverviewScreen;
