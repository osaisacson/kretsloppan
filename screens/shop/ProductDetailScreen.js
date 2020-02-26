import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import UserAvatar from '../../components/UI/UserAvatar';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ButtonToggle from '../../components/UI/ButtonToggle';
import { Button } from 'react-native-paper';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductDetailScreen = props => {
  const productId = props.route.params.productId;
  const ownerId = props.route.params.ownerId;

  const loggedInUserId = useSelector(state => state.auth.userId);

  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above
  const [isToggled, setIsToggled] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hasEditPermission = ownerId === loggedInUserId;

  const editProductHandler = id => {
    navigation.navigate('EditProduct', { productId: id });
  };

  const isReady = selectedProduct.status === 'redo';
  const isReserved = selectedProduct.status === 'reserverad';
  const isPickedUp = selectedProduct.status === 'hämtad';

  const deleteHandler = () => {
    const id = selectedProduct.id;
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här produkten? Det går inte att gå ändra sig sen.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(productsActions.deleteProduct(id));
          }
        }
      ]
    );
  };

  const collectHandler = () => {
    const id = selectedProduct.id;
    Alert.alert(
      'Är produkten hämtad?',
      'Genom att klicka här bekräftar du att produkten är hämtad. Den kommer då försvinna från det aktiva förrådet och hamna i ditt Gett Igen förråd.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, flytta den',
          style: 'destructive',
          onPress: () => {
            dispatch(productsActions.changeProductStatus(id, 'hämtad'));
          }
        }
      ]
    );
  };

  const toggleIsReadyHandle = () => {
    const id = selectedProduct.id;
    setIsToggled(prevState => !prevState);
    let status = selectedProduct.status === 'bearbetas' ? 'redo' : 'bearbetas';
    dispatch(productsActions.changeProductStatus(id, status));
    goBack();
  };

  const reserveHandler = () => {
    const id = selectedProduct.id;
    var firstDay = new Date();
    const oneWeekFromNow = new Date(
      firstDay.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    Alert.alert(
      'Kom ihåg',
      'Du måste kontakta säljaren för att komma överens om hämtningstid',
      [
        { text: 'Cancel', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.reserveProduct(
                id,
                'reserverad',
                oneWeekFromNow //TBD: this currently sends the booked date to the product object successfully, but we still need to set the automated expiry date
              )
            );
            navigation.navigate('ProductsOverview');
          }
        }
      ]
    );
  };

  const shorterDate = selectedProduct.reservedUntil
    ? selectedProduct.reservedUntil.split('T')[0]
    : 'never';

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.image }} />

      {/* Buttons to show if the user has edit permissions and the item is not yet picked up */}
      {hasEditPermission && !isPickedUp ? (
        <View style={styles.actions}>
          {/* Delete button */}
          <ButtonIcon
            icon="delete"
            color={Colors.warning}
            onSelect={deleteHandler.bind(this)}
          />
          {isReserved ? (
            //Show 'hämtas/hämtad' button only if the product is reserved
            <ButtonToggle
              icon="star"
              title="byt till hämtad"
              onSelect={collectHandler.bind(this)}
            />
          ) : (
            //else show 'redo/bearbetas' button
            <ButtonToggle
              isToggled={isToggled}
              icon={isReady ? 'hammer' : ''}
              title={`byt till ${isReady ? 'bearbetas' : 'redo'}`}
              onSelect={toggleIsReadyHandle.bind(this)}
            />
          )}
          <ButtonIcon
            icon="pen"
            color={Colors.neutral}
            onSelect={() => {
              editProductHandler(selectedProduct.id);
            }}
          />
        </View>
      ) : null}

      {/* Buttons to always show, but to have conditional type based on   */}
      <View style={styles.toggles}>
        <Button
          mode="contained"
          compact={true}
          color={Colors.primary}
          disabled={isReserved || isPickedUp} //disable/enable base on true/false of these params
          style={{
            width: '60%',
            alignSelf: 'center',
            marginBottom: 20
          }}
          labelStyle={{
            paddingTop: 2,
            fontFamily: 'bebas-neue-bold',
            fontSize: 12
          }}
          compact={true}
          onPress={reserveHandler.bind(this)}
        >
          {isPickedUp
            ? 'hämtad'
            : isReserved
            ? `reserverad till ${shorterDate}`
            : 'reservera'}
        </Button>
      </View>

      {/* Information about the product */}
      <Text style={styles.description}>
        Ta kontakt med dessa åkare om ni behöver hjälp med transporten:
      </Text>
      <Text style={styles.description}>(lista)</Text>
      <Text style={styles.price}>
        {selectedProduct.price ? selectedProduct.price : 0} kr
      </Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.productTitle,
    headerRight: () => (
      <UserAvatar
        style={{ paddingTop: 10 }}
        showBadge={true}
        actionOnPress={() => {
          navData.navigation.navigate('Admin');
        }}
      />
    )
  };
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%'
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center'
  },
  toggles: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center'
  },
  price: {
    fontFamily: 'roboto-regular',
    fontSize: 20,
    textAlign: 'right',
    marginHorizontal: 20
  },
  description: {
    fontFamily: 'roboto-regular',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
