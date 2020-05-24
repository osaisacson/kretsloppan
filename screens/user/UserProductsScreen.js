import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
//Components
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import SaferArea from '../../components/UI/SaferArea';
import SearchBar from '../../components/UI/SearchBar';
//Actions
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = (props) => {
  //Get user products from state
  const userProducts = useSelector((state) => state.products.userProducts);

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

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', loadProducts);
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [loadProducts]);

  const searchHandler = (text) => {
    const newData = renderedProducts.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProducts(text.length ? newData : userProducts);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (id, ownerId, title, detailPath) => {
    props.navigation.navigate(detailPath, {
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

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState text="Inga produkter ännu, prova lägga till några." />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        placeholder="Leta bland ditt återbruk"
        searchQuery={searchQuery}
      />
      <HeaderTwo
        icon={<MaterialIcons name="file-upload" size={20} style={{ marginRight: 5 }} />}
        indicator={productsSorted.length ? productsSorted.length : 0}
        subTitle="Allt som är redo att hämtas, väntar på eller har blivit hämtat."
        title="Ditt upplagda återbruk"
      />
      <FlatList
        data={productsSorted}
        horizontal={false}
        initialNumToRender={8}
        keyExtractor={(item) => item.id}
        numColumns={3}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        renderItem={(itemData) => (
          <ProductItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title,
                'ProductDetail'
              );
            }}
          />
        )}
      />
    </SaferArea>
  );
};

export default UserProductsScreen;
