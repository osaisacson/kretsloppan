import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
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
  const [renderedProducts, setRenderedProducts] = useState(products);
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
    const newData = renderedProducts.filter((item) => {
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
      ownerId: ownerId,
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
        actionOnChangeText={(text) => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland återbruk"
      />
      <FlatList
        numColumns={3}
        initialNumToRender={12}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={renderedProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProductItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title
              );
            }}
          ></ProductItem>
        )}
        ListHeaderComponent={
          <HeaderTwo
            title={'Allt återbruk'}
            subTitle={
              'Ikonerna indikerar om de är under bearbetning, reserverade eller hämtade.'
            }
            questionText={'Här ska det vara en förklaring'}
            icon={
              <MaterialCommunityIcons
                name="hammer"
                size={20}
                style={{ marginRight: 5 }}
              />
            }
            indicator={renderedProducts.length ? renderedProducts.length : 0}
          />
        }
      />
    </View>
  );
};

export default ProductsScreen;
