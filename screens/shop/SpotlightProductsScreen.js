import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  View,
  Text,
  ScrollView,
  Button,
  Platform,
  StyleSheet
  // TouchableOpacity
} from 'react-native';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
// import { Ionicons } from '@expo/vector-icons';
import AddButton from '../../components/UI/AddButton';
import EmptyState from '../../components/UI/EmptyState';
import UserAvatar from '../../components/UI/UserAvatar';
import Loader from '../../components/UI/Loader';
import HeaderButton from '../../components/UI/HeaderButton';
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
    product => product.status === 'bokad'
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

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      params: { productId: id, productTitle: title }
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
    return <EmptyState>Inga produkter ännu. Lägg till några!</EmptyState>;
  }

  return (
    <View>
      <ScrollView>
        <HorizontalScroll
          title={'nya tillskott'}
          subTitle={'Det fräschaste, det nyaste'}
          scrollData={recentProducts}
        />
        <HorizontalScroll
          title={'under bearbetning'}
          subTitle={'Kommer snart, håller på att utvärderas eller repareras'}
          scrollData={inProgressProducts}
        />
        <HorizontalScroll
          title={'nyligen bokat'}
          subTitle={
            'Bokade produkter, om de inte hämtas inom en vecka kan de bli bokade igen'
          }
          scrollData={bookedProducts}
        />
        <HorizontalScroll
          title={'efterlysningar'}
          subTitle={'Material som önskas. Kontakta efterlysaren.'}
          scrollData={wantedProducts}
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
