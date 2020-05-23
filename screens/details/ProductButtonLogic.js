import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Alert, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import Moment from 'moment/min/moment-with-locales';

import { detailStyles } from '../../components/wrappers/DetailWrapper';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import ButtonAction from '../../components/UI/ButtonAction';
import StatusBadge from '../../components/UI/StatusBadge';
import SmallRoundItem from '../../components/UI/SmallRoundItem';
import RoundItem from '../../components/UI/RoundItem';
import UserAvatar from '../../components/UI/UserAvatar';

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
  const [showOptions, setShowOptions] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);

  //Get all projects from state, and then return the ones that matches the id of the current product
  const userProjects = useSelector((state) => state.projects.userProjects);

  const {
    id,
    projectId,
    status,
    ownerId,
    reservedUserId,
    collectingUserId,
    newOwnerId,
    reservedUntil,
    collectingDate,
    phone,
    address,
  } = props.selectedProduct;

  //These will change based on where we are in the reservation process
  let receivingId;
  let statusText;
  let statusIcon;
  let statusColor;

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const hasEditPermission = props.hasEditPermission;

  if (isReserved) {
    receivingId = reservedUserId;
    statusText = `Reserverad ${isReservedUser ? 'av dig ' : ''}tills ${Moment(
      reservedUntil
    )
      .locale('sv')
      .calendar()}`;
    statusIcon = 'clock';
    statusColor = Colors.primary;
  }

  if (isOrganised) {
    receivingId = collectingUserId;
    statusText = `Upphämtning satt till ${Moment(collectingDate)
      .locale('sv')
      .calendar()}`;
    statusIcon = 'star';
    statusColor = Colors.neutral;
  }

  if (isPickedUp) {
    receivingId = newOwnerId;
    statusText = `Hämtad${isReservedUser ? ' av dig' : ''}!`;
    statusIcon = 'checkmark';
    statusColor = Colors.completed;
  }

  //Avatar logic
  const profiles = useSelector((state) => state.profiles.allProfiles);

  const ownerProfile = profiles.find(
    (profile) => profile.profileId === ownerId
  );

  const receivingProfile = profiles.find(
    (profile) => profile.profileId === receivingId
  );

  const associatedProject = useSelector(
    (state) => state.projects.availableProjects
  );

  const projectForProduct = associatedProject.find(
    (proj) => proj.id === projectId
  );

  console.log('receivingId: ', receivingId);
  console.log('receivingProfile: ', receivingProfile);
  console.log('statusText: ', statusText);
  console.log('statusIcon: ', statusIcon);
  console.log('statusColor: ', statusColor);

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
            setShowUserProjects(false);
            // props.navigation.navigate('Min Sida');
          },
        },
      ]
    );
  };

  const toggleReserveButton = () => {
    setShowUserProjects((prevState) => !prevState);
  };

  const toggleShowOptions = () => {
    setShowOptions((prevState) => !prevState);
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

  const HeaderAvatar = (props) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <UserAvatar
          userId={props.profileId}
          style={{ marginRight: 10 }}
          showBadge={false}
          actionOnPress={() => {
            props.navigation.navigate('Användare', {
              detailId: props.profileId,
            });
          }}
        />
        {props.showName ? (
          <Text
            style={{
              textAlign: 'left',
              fontFamily: 'roboto-regular',
              fontSize: 14,
            }}
          >
            {props.profile.profileName}
          </Text>
        ) : null}
      </View>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={{ marginTop: 20 }}>
      {/* If we have a status of the product, show a badge with conditional copy */}
      {statusText ? (
        <StatusBadge
          style={{ alignSelf: 'center', marginTop: 10 }}
          text={statusText}
          icon={
            Platform.OS === 'android' ? `md-${statusIcon}` : `ios-${statusIcon}`
          }
          backgroundColor={statusColor}
        />
      ) : null}

      <View style={styles.oneLineSpread}>
        <HeaderAvatar
          profileId={ownerId}
          profile={ownerProfile}
          navigation={props.navigation}
        />
        <Button
          icon="unfold-more-horizontal"
          mode="text"
          onPress={toggleShowOptions}
        />
        <View style={styles.oneLineRight}>
          {receivingProfile ? (
            <View style={styles.centerAlign}>
              <HeaderThree text={'Av:'} />
              <HeaderAvatar
                profileId={receivingId}
                profile={receivingProfile}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {projectForProduct ? (
            <View style={styles.centerAlign}>
              <HeaderThree text={'Till:'} />
              <SmallRoundItem
                detailPath={'ProjectDetail'}
                item={projectForProduct}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {!isReserved && !isOrganised && !isPickedUp ? (
            <ButtonAction
              disabled={isReserved}
              onSelect={toggleReserveButton}
              title={'reservera'}
            />
          ) : null}
        </View>
      </View>

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

      {/* Details about the item, and options for the logistics */}
      {showOptions ? (
        <>
          <View style={styles.oneLineSpread}>
            <View>
              <Text style={styles.contactDetailsLeft}>
                {ownerProfile.profileName}
              </Text>
              <Text style={styles.contactDetailsLeft}>
                {ownerProfile.email
                  ? ownerProfile.email
                  : 'Ingen email angiven'}
              </Text>
              <Text style={styles.contactDetailsLeft}>
                {phone ? phone : 'Ingen telefon angiven'}
              </Text>
              {address ? (
                <Text style={styles.contactDetailsLeft}>
                  {address ? address : 'Ingen address angiven'}
                </Text>
              ) : null}
            </View>

            {receivingProfile ? (
              <View>
                <Text style={styles.contactDetailsRight}>
                  {receivingProfile.profileName}
                </Text>
                <Text style={styles.contactDetailsRight}>
                  {receivingProfile.email
                    ? receivingProfile.email
                    : 'Ingen email angiven'}
                </Text>
                <Text style={styles.contactDetailsRight}>
                  {receivingProfile.phone
                    ? receivingProfile.phone
                    : 'Ingen telefon angiven'}
                </Text>
                {receivingProfile.address ? (
                  <Text style={styles.contactDetailsRight}>
                    {receivingProfile.address
                      ? receivingProfile.address
                      : 'Ingen address angiven'}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
          {/* Show a prompt if the product has not yet sorted logistics, and if the viewer is any of the involved parties  */}
          {!isOrganised &&
          (hasEditPermission || isReservedUser || isOrganisedUser) ? (
            <HeaderThree
              text={`Kontakta varandra in${Moment(reservedUntil)
                .locale('sv')
                .endOf('hour')
                .subtract(1, 'hour')
                .fromNow()}`}
              style={detailStyles.centeredHeader}
            />
          ) : null}
          {/* TBD: In-app messaging - Button for passing an object 
            reference to the in-app messaging screen */}
          {/* <ButtonAction
              large={true}
              icon="email"
              title={'Skicka meddelande'} //Send message
              onSelect={() => {}} //Should open the in-app messaging view, forwarding a title to what the message is about: {`Angående: ${objectForDetails.title}`}. Title should in the message link to the post it refers to.
            /> */}
        </>
      ) : null}
    </View>
  );

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
        <StatusBadge
          style={{ alignSelf: 'center', marginTop: 10 }}
          text={`Hämtad${isReservedUser ? ' av dig' : ''}!`}
          icon={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
          backgroundColor={Colors.completed}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oneLineRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  contactDetailsRight: {
    textAlign: 'right',
  },
});

export default ProductButtonLogic;
