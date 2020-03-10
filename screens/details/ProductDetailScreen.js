import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Text, Image, Alert } from 'react-native';
import {
  DetailWrapper,
  detailStyles
} from '../../components/wrappers/DetailWrapper';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import RoundItem from '../../components/UI/RoundItem';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ButtonToggle from '../../components/UI/ButtonToggle';
import ButtonNormal from '../../components/UI/ButtonNormal';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductDetailScreen = props => {
  const [isToggled, setIsToggled] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);
  const productId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;

  const loggedInUserId = useSelector(state => state.auth.userId);
  //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  //projects
  const userProjects = useSelector(state => state.projects.userProjects);
  const projectForProduct = userProjects.filter(
    proj => proj.id === selectedProduct.projectId
  );
  //Find the profile that matches the ownerId of the current User
  const productOwner = useSelector(state =>
    state.profiles.allProfiles.find(
      prof => prof.profileId === selectedProduct.ownerId
    )
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hasEditPermission = ownerId === loggedInUserId;

  const editProductHandler = id => {
    navigation.navigate('EditProduct', { detailId: id });
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
    props.navigation.goBack();
  };

  const toggleReserveButton = () => {
    setShowUserProjects(prevState => !prevState);
  };

  const reserveHandler = clickedProjectId => {
    const id = selectedProduct.id;
    const projectId = clickedProjectId ? clickedProjectId : '';

    var firstDay = new Date();
    const oneWeekFromNow = new Date(
      firstDay.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    Alert.alert(
      'Kom ihåg',
      'Du måste själv kontakta säljaren för att komma överens om hämtningstid',
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
                oneWeekFromNow,
                projectId
              )
            );
            navigation.navigate('BottomTabs');
          }
        }
      ]
    );
  };

  const shorterDate = selectedProduct.reservedUntil
    ? selectedProduct.reservedUntil.split('T')[0]
    : 'never';

  const isReservedOrPickedUp = isReserved || isPickedUp;

  return (
    <DetailWrapper>
      <Image
        style={detailStyles.image}
        source={{ uri: selectedProduct.image }}
      />

      {/* Buttons to show if the user has edit permissions and the item is not yet picked up */}
      {hasEditPermission && !isPickedUp ? (
        <View style={detailStyles.actions}>
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
      <View style={detailStyles.toggles}>
        <ButtonNormal
          color={Colors.primary}
          disabled={isReservedOrPickedUp} //disable/enable base on true/false of these params
          actionOnPress={toggleReserveButton}
          text={
            isPickedUp
              ? 'hämtad'
              : isReserved
              ? `reserverad till ${shorterDate}`
              : 'reservera'
          }
        />

        {/* Show the horizontal scroll of the user's projects if the product is
          not picked up or reserved yet */}
        {!isReservedOrPickedUp && showUserProjects ? (
          <>
            <Text style={detailStyles.centeredHeader}>
              Vilket projekt återbruket användas i?
            </Text>
            <HorizontalScrollContainer>
              {userProjects.map(item => (
                <RoundItem
                  title="välj vilket projekt återbruket ska användas i"
                  itemData={item}
                  key={item.id}
                  isHorizontal={true}
                  onSelect={() => {
                    reserveHandler(item.id);
                  }}
                />
              ))}
            </HorizontalScrollContainer>
          </>
        ) : null}
        {selectedProduct.projectId && isReservedOrPickedUp ? (
          <View style={detailStyles.centered}>
            <Text style={detailStyles.centeredHeader}>
              {isPickedUp ? 'Används i ' : 'Reserverad för '}
            </Text>
            <HorizontalScroll
              roundItem={true}
              detailPath={'ProjectDetail'}
              scrollData={projectForProduct}
              navigation={props.navigation}
            />
          </View>
        ) : null}
      </View>

      {/* Information about the product */}
      <Text style={detailStyles.price}>
        {selectedProduct.price ? `${selectedProduct.price} kr` : 'gratis'}
      </Text>
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          {selectedProduct.description}
        </Text>
      </View>
      <Text style={detailStyles.sectionHeader}>Hämtas från</Text>
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          {productOwner.address
            ? productOwner.address
            : 'Ingen address angiven'}
        </Text>
      </View>
      <Text style={detailStyles.sectionHeader}>Kontakt</Text>
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          {productOwner.phone
            ? productOwner.phone
            : 'Inget kontaktnummer angivet'}
        </Text>
      </View>
      <Text style={detailStyles.sectionHeader}>Transport</Text>
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          Ta kontakt med dessa åkare om ni behöver hjälp med transporten:
        </Text>
        <Text style={detailStyles.boundaryText}>(lista)</Text>
      </View>
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.detailTitle
  };
};

export default ProductDetailScreen;
