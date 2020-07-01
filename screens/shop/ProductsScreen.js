import React, { useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { createFilter } from 'react-native-search-filter';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import SearchBar from '../../components/UI/SearchBar';
import * as productsActions from '../../store/actions/products';

const ProductsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get original products from state
  const products = useSelector((state) => state.products.availableProducts);

  //Prepare for changing the rendered products on search
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  //Load products
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('ProductsScreen: fetching products...');
      dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  //Set which fields to filter by
  const KEYS_TO_FILTERS = [
    'category',
    'condition',
    'style',
    'material',
    'color',
    'title',
    'description',
    'background',
    'length',
    'height',
    'width',
    'price',
    'priceText',
    'status',
    'internalComments',
  ];

  const filteredProductsRaw = products.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

  const filteredProducts = filteredProductsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  if (error) {
    return <Error actionOnPress={loadProducts} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && products.length === 0) {
    return <EmptyState text="Inga produkter hittade." />;
  }

  return (
    <View>
      <SearchBar
        placeholder="Leta bland återbruk: titel, skick, mått..."
        onChangeText={(term) => setSearchQuery(term)}
      />
      <FlatList
        numColumns={2}
        initialNumToRender={12}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            navigation={props.navigation}
            showSmallStatusIcons
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
            }}
          />
        )}
        ListHeaderComponent={
          <HeaderTwo
            isSearch
            simpleCount={filteredProducts.length}
            showAddLink={() => props.navigation.navigate('EditProduct')}
            indicator={filteredProducts.length ? filteredProducts.length : 0}
          />
        }
      />
    </View>
  );
};

export default ProductsScreen;
