import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AddButton from '../../components/UI/AddButton';
import ContentHeader from '../../components/UI/ContentHeader';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/shop/ProductItem';
//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const ProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);

  const productsSorted = products.sort(function(a, b) {
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
    const unsubscribe = props.navigation.addListener('focus', loadProducts);

    return () => {
      unsubscribe();
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
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
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
    return <EmptyState text="Inga produkter ännu, prova lägga till några." />;
  }

  return (
    <View>
      <ContentHeader
        title={'Aktivt Förråd'}
        subTitle={'Allt som är redo att hämtas'}
        indicator={productsSorted.length ? productsSorted.length : 0}
      />
      <FlatList
        horizontal={false}
        numColumns={2}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={productsSorted}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <ProductItem
            image={itemData.item.image}
            title={itemData.item.title}
            price={itemData.item.price ? itemData.item.price : 0}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          ></ProductItem>
        )}
      />
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductsScreen;
