import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Text, Image, Alert } from 'react-native';
import {
  DetailWrapper,
  detailStyles,
} from '../../components/wrappers/DetailWrapper';
import ContactDetails from '../../components/UI/ContactDetails';
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

const ProductDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const productId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;
  const loggedInUserId = useSelector((state) => state.auth.userId);

  const [isToggled, setIsToggled] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);

  //Find us the product that matches the current productId
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  //Get all projects from state, and then return the ones that matches the id of the current product
  //TODO: if has no matching project, return visual for no project
  const userProjects = useSelector((state) => state.projects.userProjects);
  const projectForProduct = userProjects.filter(
    (proj) => proj.id === selectedProduct.projectId
  );

  //Check if the currently logged in user is the one who created the product, and thereby should have editing privileges
  const hasEditPermission = ownerId === loggedInUserId;

  const editProductHandler = (id) => {
    navigation.navigate('EditProduct', { detailId: id });
  };

  const isReady = selectedProduct.status === 'redo';
  const isReserved = selectedProduct.status === 'reserverad';
  const isPickedUp = selectedProduct.status === 'hämtad';

  const deleteHandler = () => {
    const id = selectedProduct.id;
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här produkten? Det går inte att gå ändra sig när det väl är gjort.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(productsActions.deleteProduct(id));
          },
        },
      ]
    );
    navigation.goBack();
  };

  const collectHandler = () => {
    const id = selectedProduct.id;
    const projectId = selectedProduct.projectId;
    Alert.alert(
      'Är produkten hämtad?',
      'Genom att klicka här bekräftar du att produkten är hämtad. Den kommer då försvinna från det aktiva förrådet och hamna i ditt Gett Igen förråd.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, flytta den',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(id, 'hämtad', projectId)
            );
          },
        },
      ]
    );
  };

  const toggleIsReadyHandle = () => {
    const id = selectedProduct.id;
    setIsToggled((prevState) => !prevState);
    let status = selectedProduct.status === 'bearbetas' ? 'redo' : 'bearbetas';
    dispatch(productsActions.changeProductStatus(id, status));
    props.navigation.goBack();
  };

  const toggleReserveButton = () => {
    setShowUserProjects((prevState) => !prevState);
  };

  const reserveHandler = (clickedProjectId) => {
    const id = selectedProduct.id;
    const projectId = clickedProjectId ? clickedProjectId : '000';

    Alert.alert(
      'Kom ihåg',
      'Du måste själv kontakta säljaren för att komma överens om hämtningstid. Du hittar reservationen under din profil.',
      [
        { text: 'Cancel', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(id, 'reserverad', projectId)
            );
            props.navigation.navigate('Min Sida');
          },
        },
      ]
    );
  };

  const shorterDate = selectedProduct.reservedUntil
    ? selectedProduct.reservedUntil.split('T')[0]
    : 'never';

  const isReservedOrPickedUp = isReserved || isPickedUp;

  return (
    <DetailWrapper>
      {/* Show info about picking up the product only the user is not the creator of the product */}
      {hasEditPermission ? null : (
        <ContactDetails
          profileId={ownerId}
          productId={selectedProduct.id}
          hideButton={isReserved || isPickedUp}
          buttonText={'hämtningsdetaljer'}
        />
      )}
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
              Vilket projekt ska återbruket användas i?
            </Text>
            <HorizontalScrollContainer>
              <RoundItem
                itemData={{
                  image: './../../assets/avatar-placeholder-image.png',
                  title: 'Inget projekt',
                }}
                key={'000'}
                isHorizontal={true}
                onSelect={() => {
                  reserveHandler('000');
                }}
              />
              {userProjects.map((item) => (
                <RoundItem
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
        {selectedProduct &&
        selectedProduct.projectId &&
        projectForProduct.length &&
        isReservedOrPickedUp ? (
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
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          {selectedProduct.description}
        </Text>
      </View>
      <Text style={detailStyles.price}>
        {selectedProduct.price ? `${selectedProduct.price} kr` : 'gratis'}
      </Text>
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.detailTitle,
  };
};

export default ProductDetailScreen;
