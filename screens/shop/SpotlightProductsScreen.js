import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import { View, Text, ScrollView, Button } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import HorizontalPicker from '../../components/UI/HorizontalPicker';

//Actions
import * as productsActions from '../../store/actions/products';
import * as projectsActions from '../../store/actions/projects';
import * as proposalsActions from '../../store/actions/proposals';

//Constants
import Colors from '../../constants/Colors';

const SpotlightProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get products and projects
  const allProducts = useSelector(state => state.products.availableProducts);
  const allProjects = useSelector(state => state.projects.availableProjects);
  const allProposals = useSelector(state => state.proposals.availableProposals);

  const recentProducts = allProducts.filter(
    product => product.status === 'redo'
  ); //Gets last 10 items uploaded that have the status of 'redo'

  //Gets all currently being worked on products
  const inProgressProducts = allProducts.filter(
    product => product.status === 'bearbetas'
  );

  //Gets all booked products
  const bookedProducts = allProducts.filter(
    product => product.status === 'reserverad'
  );

  const dispatch = useDispatch();

  const introductionData = [
    {
      image:
        'https://images.unsplash.com/photo-1501366062246-723b4d3e4eb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1973&q=80',
      title: 'Välkommen!'
    },
    {
      image:
        'https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',

      title: 'Introduktion'
    },
    {
      image:
        'https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      title: 'Avslutning'
    }
  ];

  //Load products and projects
  const loadProductsAndProjects = useCallback(async () => {
    setError(null);
    try {
      await dispatch(productsActions.fetchProducts());
      await dispatch(projectsActions.fetchProjects());
      await dispatch(proposalsActions.fetchProposals());
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

  // useEffect(() => {
  //   setIsLoading(true);
  //   const unsubscribe = props.navigation.addListener(
  //     'focus',
  //     loadProductsAndProjects
  //   );
  //   loadProductsAndProjects().then(() => {
  //     setIsLoading(false);
  //     unsubscribe();
  //   });
  // }, [dispatch, loadProductsAndProjects]);

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
        {/* <HorizontalPicker pickerData={introductionData} /> */}
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
          textItem={true}
          detailPath="ProposalDetail"
          title={'efterlysningar'}
          subTitle={'Material som önskas. Kontakta efterlysaren.'}
          scrollData={allProposals}
          navigation={props.navigation}
        />
      </ScrollView>
    </SaferArea>
  );
};

export default SpotlightProductsScreen;
