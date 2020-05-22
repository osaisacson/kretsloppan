import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Alert } from 'react-native';
import Moment from 'moment/min/moment-with-locales';

import { detailStyles } from '../../components/wrappers/DetailWrapper';
import ContactDetails from '../../components/UI/ContactDetails';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import ButtonAction from '../../components/UI/ButtonAction';
import StatusBadge from '../../components/UI/StatusBadge';
import RoundItem from '../../components/UI/RoundItem';

//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductButtonLogic = (props) => {
  const dispatch = useDispatch();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const loggedInUserId = useSelector((state) => state.auth.userId);

  //Set up state hooks
  const [isLoading, setIsLoading] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);

  //Get all projects from state, and then return the ones that matches the id of the current product
  const userProjects = useSelector((state) => state.projects.userProjects);

  const {
    id,
    projectId,
    status,
    reservedUserId,
    collectingUserId,
    newOwnerId,
    reservedUntil,
    collectingDate,
  } = props.selectedProduct;
  const hasEditPermission = props.hasEditPermission;

  //Check status of product and privileges of user
  const isReady = status === 'redo';
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;

  const reserveHandler = (clickedProjectId) => {
    const checkedProjectId = clickedProjectId ? clickedProjectId : '000';

    Alert.alert(
      'Kom ihåg',
      'Denna reservation gäller i ett dygn. Du måste själv kontakta säljaren för att komma överens om hämtningstid. Du hittar reservationen under din profil.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(
                id,
                'reserverad',
                checkedProjectId
              )
            );
            props.navigation.navigate('Min Sida');
          },
        },
      ]
    );
  };

  const toggleReserveButton = () => {
    setShowUserProjects((prevState) => !prevState);
  };

  const unReserveHandler = () => {
    Alert.alert(
      'Avbryt reservation?',
      'Om du avbryter reservationen kommer återbruket igen bli tillgängligt för andra.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, ta bort',
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            dispatch(productsActions.unReserveProduct(id)).then(
              setIsLoading(false)
            );
          },
        },
      ]
    );
  };

  const setAsOrganised = () => {
    const checkedProjectId = projectId ? projectId : '000';

    Alert.alert(
      'Överenskommet',
      'Genom att klicka här markerar du att ni kommit överens om när ni ska hämta/lämna återbruket.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(
                id,
                'ordnad',
                checkedProjectId,
                reservedUserId,
                new Date()
              )
            );
            setShowUserProjects(false);
          },
        },
      ]
    );
  };

  const collectHandler = () => {
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
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={{ marginVertical: 20 }}>
      {/* If product is not reserved */}
      {isReady && !hasEditPermission ? (
        <>
          <ButtonAction
            disabled={isReserved}
            onSelect={toggleReserveButton}
            title={'reservera'}
          />
          {/* When trying to reserve, open this up for selection of associated project */}
          {showUserProjects ? (
            <>
              <HeaderThree
                text={'Vilket projekt ska återbruket användas i?'}
                style={detailStyles.centeredHeader}
              />

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
        </>
      ) : null}

      {/* If product is reserved */}
      {isReserved ? (
        <>
          <StatusBadge
            style={{ alignSelf: 'center', marginTop: 10 }}
            text={`Reserverad ${isReservedUser ? 'av dig ' : ''}tills ${Moment(
              reservedUntil
            )
              .locale('sv')
              .calendar()}`}
            icon={Platform.OS === 'android' ? 'md-clock' : 'ios-clock'}
            backgroundColor={Colors.primary}
          />

          {!isReservedUser ? (
            <>
              <HeaderThree
                style={{ marginLeft: 15, marginBottom: 5 }}
                text={'Av:'}
              />
              <ContactDetails
                profileId={reservedUserId}
                hideButton={isPickedUp || !hasEditPermission}
                buttonText={'kontaktdetaljer'}
              />
            </>
          ) : null}

          {hasEditPermission || isReservedUser || isOrganisedUser ? (
            <>
              {!isOrganised ? (
                <HeaderThree
                  text={`Kontakta varandra in${Moment(reservedUntil)
                    .locale('sv')
                    .endOf('hour')
                    .subtract(1, 'hour')
                    .fromNow()}`}
                  style={detailStyles.centeredHeader}
                />
              ) : null}

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  marginVertical: 10,
                  justifyContent: 'space-around',
                }}
              >
                {/* Organising logistics - allow both parties to change the status to organised. */}
                <ButtonAction
                  style={{ marginRight: 10 }}
                  title={`Sätt upphämtningsdatum`}
                  onSelect={setAsOrganised.bind(this)}
                />

                {/* Un-reserve. */}
                {isReservedUser ? (
                  <ButtonAction
                    disabled={isPickedUp}
                    onSelect={unReserveHandler}
                    title={'avreservera'}
                  />
                ) : null}
              </View>
            </>
          ) : null}
        </>
      ) : null}

      {/* If product is organised */}
      {isOrganised ? (
        <>
          <StatusBadge
            style={{ alignSelf: 'center', marginTop: 10 }}
            text={`Upphämtning satt till ${Moment(collectingDate)
              .locale('sv')
              .calendar()}`}
            icon={Platform.OS === 'android' ? 'md-star' : 'ios-star'}
            backgroundColor={Colors.neutral}
          />
          <>
            <HeaderThree
              style={{ marginLeft: 15, marginBottom: 5 }}
              text={'Hämtas av:'}
            />
            <ContactDetails
              profileId={collectingUserId}
              hideButton={isPickedUp || !hasEditPermission}
              buttonText={'kontaktdetaljer'}
            />
          </>
          {/* Organising logistics - allow both parties to change the status to organised. */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginVertical: 10,
              justifyContent: 'space-around',
            }}
          >
            <ButtonAction
              style={{ marginRight: 10 }}
              title={'Ändra upphämtningsdatum'}
              onSelect={setAsOrganised.bind(this)}
            />
            <ButtonAction
              disabled={isPickedUp}
              title="Byt till hämtad"
              onSelect={collectHandler.bind(this)}
            />
          </View>
        </>
      ) : null}

      {/* If product is picked up */}
      {isPickedUp ? (
        <>
          <StatusBadge
            style={{ alignSelf: 'center', marginTop: 10 }}
            text={`Hämtad${isReservedUser ? ' av dig' : ''}!`}
            icon={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
            backgroundColor={Colors.completed}
          />

          {!isReservedUser ? (
            <>
              <HeaderThree
                style={{ marginLeft: 15, marginBottom: 5 }}
                text={'Ny ägare:'}
              />
              <ContactDetails
                profileId={newOwnerId}
                buttonText={'kontaktdetaljer'}
              />
            </>
          ) : null}
        </>
      ) : null}
    </View>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProductButtonLogic;
