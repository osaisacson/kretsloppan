import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  View,
  Text,
  ScrollView,
  Button,
  Alert,
  StyleSheet
} from 'react-native';
import AddButton from '../../components/UI/AddButton';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const SpotlightProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector(state => state.products.availableProducts);
  const productsSorted = products.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const recentProducts = productsSorted
    .slice(0, 10)
    .filter(product => product.status === 'redo'); //Gets last 10 items uploaded that have the status of 'redo'

  //Gets all currently being worked on products
  const inProgressProducts = productsSorted.filter(
    product => product.status === 'bearbetas'
  );

  //Gets all booked products
  const bookedProducts = productsSorted.filter(
    product => product.status === 'reserverad'
  );

  //Gets all wanted products
  const wantedProducts = productsSorted.filter(
    product => product.status === 'efterlyst'
  );

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
    return <EmptyState>Inga produkter ännu. Lägg till några!</EmptyState>;
  }

  return (
    <View>
      <ScrollView>
        <HorizontalScroll
          title={'nya tillskott'}
          subTitle={'Det fräschaste, det nyaste'}
          scrollData={recentProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'under bearbetning'}
          subTitle={'Kommer snart, håller på att utvärderas eller repareras'}
          scrollData={inProgressProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'nyligen reserverat'}
          subTitle={
            'Reserverade produkter, blir tillgängliga igenom om de inte hämtas inom en vecka.'
          }
          scrollData={bookedProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'efterlysningar'}
          subTitle={'Material som önskas. Kontakta efterlysaren.'}
          scrollData={wantedProducts}
          navigation={props.navigation}
        />
      </ScrollView>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default SpotlightProductsScreen;
