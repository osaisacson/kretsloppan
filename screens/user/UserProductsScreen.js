import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { Platform, ScrollView, View, StyleSheet, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AddButton from '../../components/UI/AddButton';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import HeaderButton from '../../components/UI/HeaderButton';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import { Avatar, Title, Caption, Paragraph, Text } from 'react-native-paper';
//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Margins from '../../constants/Margins';
//Constants
import Colors from '../../constants/Colors';

//This screen shows the products which have been uploaded by the user
const UserProductsScreen = props => {
  //check if we are loading
  const [isLoading, setIsLoading] = useState(false);
  //check if we get any errors
  const [error, setError] = useState();
  //get a slice of the userProduct state

  // const userDetails = useSelector(state => state.auth);
  const userProducts = useSelector(state => state.products.userProducts);
  const userDetails = useSelector(state => state.users.currentUser);

  const userProductsSorted = userProducts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  //Gets all booked products
  const bookedUserProducts = userProductsSorted.filter(
    product => product.status === 'bokad'
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
    product => product.status === 'gettIgen'
  );

  //Navigate to the edit screen and forward the product id
  const editUserHandler = id => {
    props.navigation.navigate('EditUser');
  };

  const dispatch = useDispatch();

  //Runs whenever the component is loaded, and fetches the latest products
  const loadProducts = useCallback(async () => {
    console.log('TBD this should hold our userDetails: ', userDetails);

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
    const unsubscribe = props.navigation.addListener('focus', loadProducts);

    return () => {
      unsubscribe();
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
      params: { productId: id, productTitle: title }
    });
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri:
                'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg'
            }}
            size={50}
          />
          <Title style={styles.title}>Dawid Urbaniak</Title>
          <Caption style={styles.caption}>@trensik</Caption>
          <Button
            title="Redigera profil"
            color={Colors.primary}
            onPress={editUserHandler}
          />
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Following</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Followers</Caption>
            </View>
          </View>
        </View>
        <HorizontalScroll
          title={'Bokat av mig'}
          subTitle={'Väntas på att hämtas av dig - se kort för detaljer'}
          extraSubTitle={'Notera att bokningen upphör gälla efter en vecka'}
          scrollData={bookedUserProducts}
          showEditAndDelete={true}
        />
        <HorizontalScroll
          title={'Under bearbetning'}
          subTitle={
            "Material som håller på att fixas. När det är redo för hämtning öppna kortet och klicka 'Redo'"
          }
          scrollData={inProgressUserProducts}
          showEditAndDelete={true}
        />
        <HorizontalScroll
          title={'Efterlysta produkter'}
          subTitle={'Mina efterlysningar'}
          scrollData={wantedUserProducts}
          showEditAndDelete={true}
        />
        <HorizontalScroll
          title={'Gett igen'}
          subTitle={'Arkiv av återbruk du gett igen'}
          scrollData={doneUserProducts}
          showEditAndDelete={true}
        />
      </ScrollView>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: Margins.leftRight
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold'
  },
  caption: {
    fontSize: 14,
    lineHeight: 14
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Margins.leftRight
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3
  },
  drawerSection: {
    marginTop: 15
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Margins.leftRight
  }
});

export const screenOptions = navData => {
  return {
    headerTitle: 'Ditt förråd',
    headerLeft: () => (
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
    headerRight: () => (
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
