import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import SearchBar from '../../components/UI/SearchBar';
import SaferArea from '../../components/wrappers/SaferArea';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = (props) => {
  //Get user products from state
  const availableProducts = useSelector((state) => state.products.availableProducts);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;
  const userProducts = availableProducts.filter((prod) => prod.ownerId === loggedInUserId);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Prepare for changing the rendered products on search
  const [renderedProducts, setRenderedProducts] = useState(userProducts);
  const [searchQuery, setSearchQuery] = useState('');

  //Sort products by date
  const productsSorted = renderedProducts.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('UserProductsScreen: fetching Products');
      dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  const searchHandler = (text) => {
    const newData = renderedProducts.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProducts(text.length ? newData : userProducts);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (itemData) => {
    props.navigation.navigate('ProductDetail', {
      itemData: itemData,
    });
  };

  if (error) {
    return <Error actionOnPress={loadProducts} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState text="Inga produkter ännu, prova lägga till några." />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland ditt återbruk"
      />

      <FlatList
        numColumns={2}
        initialNumToRender={12}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={productsSorted}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            navigation={props.navigation}
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData);
            }}
          />
        )}
        ListHeaderComponent={
          <HeaderTwo
            isSearch
            simpleCount={productsSorted.length}
            showAddLink={() => props.navigation.navigate('EditProduct')}
            indicator={productsSorted.length ? productsSorted.length : 0}
          />
        }
      />
    </SaferArea>
  );
};

export default UserProductsScreen;
