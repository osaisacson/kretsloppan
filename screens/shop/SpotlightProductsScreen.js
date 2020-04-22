import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import { ScrollView } from 'react-native';
import { Image, Text } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Banner } from 'react-native-paper';

//Screens
import ProductsScreen from '../shop/ProductsScreen';

//Actions
import * as productsActions from '../../store/actions/products';
import * as projectsActions from '../../store/actions/projects';
import * as proposalsActions from '../../store/actions/proposals';

const SpotlightProductsScreen = (props) => {
  const isMountedRef = useRef(null);
  const Tab = createMaterialTopTabNavigator();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [visibleBanner, setVisibleBanner] = useState(true);

  const dispatch = useDispatch();

  //Load products and projects
  const loadProductsAndProjects = useCallback(async () => {
    setError(null);
    try {
      console.log('SpotlightScreen: fetching Products/Projects/Proposals');
      await dispatch(productsActions.fetchProducts());
      await dispatch(projectsActions.fetchProjects());
      await dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      console.log(
        'Error when trying to loadProductsAndProjects: ',
        err.message
      );
      setError(err.message);
    }
  }, [setIsLoading, setError]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);

    if (isMountedRef.current) {
      loadProductsAndProjects().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [loadProductsAndProjects]);

  //Get products and projects
  const allProducts = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector(
    (state) => state.proposals.availableProposals
  );

  const recentProducts = allProducts.filter(
    (product) => product.status === 'redo'
  ); //Gets last 10 items uploaded that have the status of 'redo'

  //Gets all currently being worked on products
  const inProgressProducts = allProducts.filter(
    (product) => product.status === 'bearbetas'
  );

  //Gets all booked products
  const bookedProducts = allProducts.filter(
    (product) => product.status === 'reserverad'
  );

  //Error handling
  if (error) {
    return <Error actionOnPress={loadProductsAndProjects} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && allProducts.length === 0) {
    return <EmptyState>Inga produkter ännu. Lägg till några!</EmptyState>;
  }

  const Spotlight = (props) => {
    return (
      <SaferArea>
        <Banner
          visible={visibleBanner}
          actions={[
            {
              label: 'Stäng introduktionen',
              onPress: () => setVisibleBanner(false),
            },
          ]}
        >
          <Image
            style={{
              width: 380,
              height: 150,
              borderRadius: 6,
            }}
            source={{
              uri:
                'https://images.unsplash.com/photo-1489533119213-66a5cd877091?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80',
            }}
          />
          <Text
            style={{
              fontFamily: 'roboto-light-italic',
              paddingVertical: 10,
            }}
          >
            Här kan vi ha en liten introduktionstext med fina bilder.
          </Text>
        </Banner>
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

  return (
    <Tab.Navigator>
      <Tab.Screen name="Spotlight" component={Spotlight} />
      <Tab.Screen name="Allt återbruk" component={ProductsScreen} />
    </Tab.Navigator>
  );
};

export default SpotlightProductsScreen;
