import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { Platform, ScrollView } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import HeaderButton from '../../components/UI/HeaderButton';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
//Actions
import * as productsActions from '../../store/actions/products';

//This screen shows the products which have been uploaded by the user
const UserProductsScreen = props => {
  //check if we are loading
  const [isLoading, setIsLoading] = useState(false);
  //check if we get any errors
  const [error, setError] = useState();
  //get a slice of the userProduct state

  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  //Runs whenever the component is loaded, and fetches the latest products
  const loadProducts = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  //Update the menu when there's new data: when the screen focuses (see docs for other options, like onBlur), call loadProducts again
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'willFocus',
      loadProducts
    );
    //Cleanup afterwards. Removes the subscription
    return () => {
      willFocusSubscription.remove();
    };
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, [dispatch, loadProducts]);

  //Om något gick fel, visa ett error message
  if (error) {
    return <Error actionOnPress={loadProducts} />;
  }

  //Om vi inte har några produkter än: visa ett empty state
  if (!isLoading && (userProducts.length === 0 || !userProducts)) {
    return <EmptyState>Inget här ännu</EmptyState>;
  }

  //Vissa en spinner när vi laddar produkter
  if (isLoading) {
    return <Loader />;
  }

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  return (
    <ScrollView>
      <HorizontalScroll
        title={'Bokat'}
        subTitle={'Väntas på att hämtas av dig - se kort för detaljer'}
        extraSubTitle={'Notera att bokningen upphör gälla efter en vecka'}
        scrollData={userProducts}
        showEditAndDelete={true}
      />
      <HorizontalScroll
        title={'Bearbetas'}
        subTitle={
          "Material som håller på att fixas. När det är redo för hämtning öppna kortet och klicka 'Redo'"
        }
        scrollData={userProducts}
        showEditAndDelete={true}
      />
      <HorizontalScroll
        title={'Aktivt Förråd'}
        subTitle={'Allt som är redo för hämtning'}
        scrollData={userProducts}
        showEditAndDelete={true}
      />
      <HorizontalScroll
        title={'Gett igen'}
        subTitle={'Arkiv av återbruk du gett igen'}
        scrollData={userProducts}
        showEditAndDelete={true}
      />
    </ScrollView>
  );
};

UserProductsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Ditt förråd',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Lägg till"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default UserProductsScreen;
