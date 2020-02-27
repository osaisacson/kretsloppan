import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import AddButton from '../../components/UI/AddButton';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const UserSpotlightScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const userProducts = useSelector(state => state.products.userProducts);
  //TBD: user profile data
  // const userDetails = useSelector(state => state.auth);
  // const userDetails = useSelector(state => state.users.currentUser);

  const userProductsSorted = userProducts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  //Gets all booked products
  const bookedUserProducts = userProductsSorted.filter(
    product => product.status === 'reserverad'
  );

  //Gets all currently being worked on products
  const inProgressUserProducts = userProductsSorted.filter(
    product => product.status === 'bearbetas'
  );

  //Gets all wanted products
  const wantedUserProducts = userProductsSorted.filter(
    product => product.status === 'efterlyst'
  );

  //Gets all done (given) products
  const doneUserProducts = userProductsSorted.filter(
    product => product.status === 'hämtad'
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

  if (!isLoading && userProducts.length === 0) {
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

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState>Inga produkter ännu. Lägg till några!</EmptyState>;
  }

  return (
    <View>
      <ScrollView>
        <HorizontalScroll
          title={'Reserverade av mig'}
          subTitle={'Väntas på att hämtas upp av dig - se kort för detaljer'}
          extraSubTitle={'Notera att reservationen upphör gälla efter en vecka'}
          scrollData={bookedUserProducts}
          showEditAndDelete={true}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'Under bearbetning'}
          subTitle={
            "Material som håller på att fixas. När det är redo för hämtning öppna kortet och klicka 'Redo'"
          }
          scrollData={inProgressUserProducts}
          showEditAndDelete={true}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'Efterlysta produkter'}
          subTitle={'Mina efterlysningar'}
          scrollData={wantedUserProducts}
          showEditAndDelete={true}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'Gett igen'}
          subTitle={'Arkiv av återbruk du gett igen'}
          scrollData={doneUserProducts}
          showEditAndDelete={true}
          navigation={props.navigation}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default UserSpotlightScreen;
