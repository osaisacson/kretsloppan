import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const ProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(
    state => state.products.availableProducts
  ).filter(product => product.status === 'redo');

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

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title
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
      <View>
        <HeaderTwo
          title={'Aktivt Förråd'}
          subTitle={'Allt som är redo att hämtas'}
          indicator={productsSorted.length ? productsSorted.length : 0}
        />
        <FlatList
          horizontal={false}
          numColumns={3}
          onRefresh={loadProducts}
          refreshing={isRefreshing}
          data={productsSorted}
          keyExtractor={item => item.id}
          renderItem={itemData => (
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
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductsScreen;
