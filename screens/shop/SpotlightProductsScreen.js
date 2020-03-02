import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import { View, Text, ScrollView, Button } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import HorizontalScroll from '../../components/UI/HorizontalScroll';

//Actions
import * as productsActions from '../../store/actions/products';
import * as projectsActions from '../../store/actions/projects';

//Constants
import Colors from '../../constants/Colors';

const SpotlightProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get products and projects
  const allProducts = useSelector(state => state.products.availableProducts);
  const allProjects = useSelector(state => state.projects.availableProjects);

  const recentProducts = allProducts
    .slice(0, 10)
    .filter(product => product.status === 'redo'); //Gets last 10 items uploaded that have the status of 'redo'

  //Gets all currently being worked on products
  const inProgressProducts = allProducts.filter(
    product => product.status === 'bearbetas'
  );

  //Gets all booked products
  const bookedProducts = allProducts.filter(
    product => product.status === 'reserverad'
  );

  //Gets all wanted products
  const wantedProducts = allProducts.filter(
    product => product.status === 'efterlyst'
  );

  const dispatch = useDispatch();

  //Load products and projects
  const loadProductsAndProjects = useCallback(async () => {
    setError(null);
    try {
      await dispatch(productsActions.fetchProducts());
      await dispatch(projectsActions.fetchProjects());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener(
      'focus',
      loadProductsAndProjects
    );
    return () => {
      unsubscribe();
    };
  }, [loadProductsAndProjects]);

  useEffect(() => {
    setIsLoading(true);
    loadProductsAndProjects().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProductsAndProjects]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProductsAndProjects}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && allProducts.length === 0) {
    return <EmptyState>Inga produkter ännu. Lägg till några!</EmptyState>;
  }

  return (
    <SaferArea>
      <ScrollView nestedScrollEnabled={true}>
        <HorizontalScroll
          roundItem={true}
          detailPath="ProjectDetail"
          title={'Projekt'}
          subTitle={'Projekt som håller på att byggas med återbruk'}
          scrollData={allProjects}
          navigation={props.navigation}
        />
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
            'Reserverade produkter, blir tillgängliga igen om om de inte hämtas inom en vecka.'
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
    </SaferArea>
  );
};

export default SpotlightProductsScreen;
