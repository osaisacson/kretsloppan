import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

//Imports
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import SearchBar from '../../components/UI/SearchBar';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get original products from state
  const products = useSelector((state) => state.products.availableProducts);

  //Prepare for changing the rendered products on search
  const [renderedProducts, setRenderedProducts] = useState();
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

  const searchHandler = (text) => {
    const newData = products.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProducts(text.length ? newData : products);
    setSearchQuery(text.length ? text : '');
  };

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

  const productsToShow = renderedProducts ? renderedProducts : products;

  return (
    <View>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland återbruk"
      />
      <FlatList
        numColumns={3}
        initialNumToRender={12}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={productsToShow}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            isSearchView
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
            }}
          />
        )}
        ListHeaderComponent={
          <HeaderTwo
            title="Allt återbruk"
            buttonIcon="plus"
            buttonText="Återbruk"
            buttonOnPress={() => props.navigation.navigate('EditProduct')}
            subTitle="Upplagda av alla"
            icon={<FontAwesome5 name="recycle" size={20} style={{ marginRight: 5 }} />}
            indicator={productsToShow.length ? productsToShow.length : 0}
          />
        }
      />
    </View>
  );
};

export default ProductsScreen;
