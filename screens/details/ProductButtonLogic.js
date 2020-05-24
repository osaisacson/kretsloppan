//Components

import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { View, Alert, Text, StyleSheet, Platform } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import ButtonAction from '../../components/UI/ButtonAction';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import RoundItem from '../../components/UI/RoundItem';
import SmallRoundItem from '../../components/UI/SmallRoundItem';
import StatusBadge from '../../components/UI/StatusBadge';
import UserAvatar from '../../components/UI/UserAvatar';
import { detailStyles } from '../../components/wrappers/DetailWrapper';
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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [suggestedDateLocal, setSuggestedDateLocal] = useState();

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
    suggestedDate,
    collectingDate,
    phone,
    address,
    sellerAgreed,
    buyerAgreed,
  } = props.selectedProduct;

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const hasEditPermission = props.hasEditPermission;

  //Will change based on where we are in the reservation process
  let receivingId;
  let statusColor;

  if (isReserved) {
    receivingId = reservedUserId;
    statusColor = Colors.primary;
  }

  if (isOrganised) {
    receivingId = collectingUserId;
    statusColor = Colors.neutral;
  }

  if (isPickedUp) {
    receivingId = newOwnerId;
    statusColor = Colors.completed;
  }

  //Avatar logic
  const profiles = useSelector((state) => state.profiles.allProfiles);

  const ownerProfile = profiles.find((profile) => profile.profileId === ownerId);

  const receivingProfile = profiles.find((profile) => profile.profileId === receivingId);

  const associatedProject = useSelector((state) => state.projects.availableProjects);

  const projectForProduct = associatedProject.find((proj) => proj.id === projectId);

  const handleTimePicker = (date) => {
    setSuggestedDateLocal(date);
    setShowTimePicker(true);
  };

  const hideTimePicker = () => {
    setShowTimePicker(false);
  };

  const reserveHandler = (clickedProjectId) => {
    const checkedProjectId = clickedProjectId ? clickedProjectId : '000';

    Alert.alert(
      'Kom ihåg',
      'Denna reservation gäller i ett dygn. Nästa steg är att föreslå en upphämtningstid och om det behövs kontakta säljaren för att diskutera detaljer. Du hittar alltid reservationen under din profil.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(productsActions.changeProductStatus(id, 'reserverad', checkedProjectId));
            setShowOptions(true);
            setShowUserProjects(false);
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
            dispatch(productsActions.unReserveProduct(id)).then(setIsLoading(false));
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  const resetSuggestedDT = () => {
    const checkedProjectId = projectId ? projectId : '000';
    const prevReservedUser = reservedUserId ? reservedUserId : collectingUserId;

    Alert.alert(
      'Ändra tid',
      'Genom att klicka här ställer du in den föreslagna tiden. Ni får då igen 24h på er att komma överens om tid.',
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
                checkedProjectId,
                prevReservedUser
              ) //by default resets the date to expire in 24 hours, since the status is 'reserved'
            );
            setSuggestedDateLocal('');
            setShowUserProjects(false);
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  const sendSuggestedDT = (dateTime) => {
    const checkedProjectId = projectId ? projectId : '000';
    const sAgreed = !!hasEditPermission;
    const bAgreed = !!(isReservedUser || isOrganisedUser);

    Alert.alert(
      'Föreslå tid',
      `Genom att klicka här föreslår du ${moment(dateTime)
        .locale('sv')
        .format(
          'HH:mm, D MMMM'
        )} som tid för upphämtning. Om motparten godkänner tiden åtar du dig att vara på överenskommen plats vid denna tidpunkt.`,
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(
                id,
                'ordnas',
                checkedProjectId,
                reservedUserId,
                dateTime //sets product.suggestedDate
              )
            );
            dispatch(productsActions.changeProductAgreement(id, sAgreed, bAgreed));
            hideTimePicker();
            setShowUserProjects(false);
          },
        },
      ]
    );
  };

  const approveSuggestedDateTime = (dateTime) => {
    const checkedProjectId = projectId ? projectId : '000';

    Alert.alert(
      'Bekräfta tid',
      'Genom att klicka här godkänner du den föreslagna tiden, och åtar dig att vara på plats/komma till bestämd plats på denna tid. För frågor och andra detaljer, kontakta varandra via uppgifterna ovan.',
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
                dateTime //if status is 'ordnad', set this to be product.collectingDate
              )
            );
            setShowUserProjects(false);
            props.navigation.navigate('Min Sida');
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
              productsActions.changeProductStatus(id, 'hämtad', projectId, collectingUserId)
            );
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  const HeaderAvatar = (props) => {
    return (
      <UserAvatar
        actionOnPress={() => {
          props.navigation.navigate('Användare', {
            detailId: props.profileId,
          });
        }}
        showBadge={false}
        style={[{ margin: 0 }, props.style]}
        userId={props.profileId}
      />
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View>
      <View style={[styles.oneLineSpread, { marginBottom: 6 }]}>
        <HeaderAvatar navigation={props.navigation} profileId={ownerId} />
        {!isPickedUp ? (
          <Button
            color={Colors.darkPrimary}
            labelStyle={{ fontSize: 10 }}
            mode="outlined"
            onPress={toggleShowOptions}
            style={{ position: 'absolute', left: '36%' }}>
            Logistik
          </Button>
        ) : null}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
          }}>
          {projectForProduct ? (
            <View style={styles.textAndBadge}>
              <View style={[styles.smallBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.smallText}>För</Text>
              </View>
              <SmallRoundItem
                detailPath="ProjectDetail"
                item={projectForProduct}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {receivingProfile ? (
            <View style={styles.textAndBadge}>
              <View style={[styles.smallBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.smallText}>Av</Text>
              </View>
              <HeaderAvatar navigation={props.navigation} profileId={receivingId} />
            </View>
          ) : null}
          {!hasEditPermission && !isReserved && !isPickedUp && !isOrganised ? (
            <ButtonAction
              disabled={isReserved}
              onSelect={toggleReserveButton}
              title="reservera i 24h"
            />
          ) : null}
        </View>
      </View>

      {/* When trying to reserve, open this up for selection of associated project */}
      {showUserProjects ? (
        <>
          <HeaderThree
            style={detailStyles.centeredHeader}
            text="Vilket projekt ska återbruket användas i?"
          />

          <HorizontalScrollContainer>
            <RoundItem
              isHorizontal
              itemData={{
                image: './../../assets/avatar-placeholder-image.png',
                title: 'Inget projekt',
              }}
              key="000"
              onSelect={() => {
                reserveHandler('000');
              }}
            />
            {userProjects.map((item) => (
              <RoundItem
                isHorizontal
                itemData={item}
                key={item.id}
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
          <Divider style={{ marginBottom: 10 }} />
          <View style={styles.oneLineSpread}>
            <View style={styles.ownerOptions}>
              <Text>{ownerProfile.profileName}</Text>
              <Text>{phone ? phone : 'Ingen telefon angiven'}</Text>
              {address ? <Text>{address ? address : 'Ingen address angiven'}</Text> : null}
            </View>

            {receivingProfile ? (
              <View style={styles.receivingOptions}>
                <Text>{receivingProfile.profileName}</Text>
                <Text>
                  {receivingProfile.phone ? receivingProfile.phone : 'Ingen telefon angiven'}
                </Text>
                {receivingProfile.address ? (
                  <Text style={{ textAlign: 'right' }}>
                    {receivingProfile.address ? receivingProfile.address : 'Ingen address angiven'}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>

          {/* Show a prompt if the product has not yet sorted logistics, and if the viewer is any of the involved parties  */}
          {isReserved && (hasEditPermission || isReservedUser || isOrganisedUser) ? (
            <>
              <Divider style={{ marginBottom: 10 }} />
              <HeaderThree
                style={{ textAlign: 'center', marginBottom: 10 }}
                text={`Reservationen går ut ${moment(reservedUntil)
                  .locale('sv')
                  .endOf('day')
                  .fromNow()}`}
              />
              {!collectingDate && suggestedDate ? (
                <>
                  <StatusBadge
                    backgroundColor={Colors.subtlePurple}
                    icon={
                      Platform.OS === 'android' ? 'md-information-circle' : 'ios-information-circle'
                    }
                    style={{
                      marginTop: 8,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}
                    text={`Väntar på godkännande ${
                      !buyerAgreed && (isReservedUser || isOrganisedUser) ? 'av dig' : 'av motpart'
                    }`}
                    textStyle={{
                      textTransform: 'uppercase',
                      fontSize: 10,
                      padding: 4,
                      color: '#fff',
                    }}
                  />
                  <View style={[styles.box, { backgroundColor: Colors.subtlePurple }]}>
                    <HeaderThree
                      style={styles.boxText}
                      text={`Föreslagen tid av ${
                        !hasEditPermission && buyerAgreed ? 'dig' : 'motpart'
                      }: ${moment(suggestedDate).locale('sv').format('D MMMM, HH:mm')}`}
                    />
                    <HeaderThree style={styles.boxText} text={`Plats: ${address}`} />
                  </View>
                </>
              ) : null}
              {!suggestedDate ? (
                <>
                  <HeaderThree
                    style={{ textAlign: 'center', marginBottom: 10 }}
                    text="Föreslå tid för upphämtning nedan."
                  />
                  <View style={{ flex: 1 }}>
                    <CalendarStrip
                      borderHighlightColor="#666"
                      borderWidth={1}
                      daySelectionAnimation={{
                        type: 'border',
                        borderWidth: 0.5,
                        borderHighlightColor: Colors.darkPrimary,
                        duration: 200,
                      }}
                      highlightDateNameStyle={{ color: Colors.darkPrimary }}
                      highlightDateNumberStyle={{ color: Colors.darkPrimary }}
                      onDateSelected={(date) => {
                        handleTimePicker(date);
                      }}
                      scrollable
                      selectedDate={suggestedDateLocal}
                      style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
                      styleWeekend
                      type="border"
                    />
                    <DateTimePickerModal
                      cancelTextIOS="Avbryt"
                      confirmTextIOS="Klar!"
                      date={new Date(suggestedDateLocal)}
                      headerTextIOS={`Valt datum ${moment(suggestedDateLocal)
                        .locale('sv')
                        .format('D MMMM')}. Välj tid:`}
                      isDarkModeEnabled
                      isVisible={showTimePicker}
                      locale="sv_SV"
                      mode="time" // Use "en_GB" here
                      onCancel={hideTimePicker}
                      onConfirm={(dateTime) => {
                        sendSuggestedDT(dateTime);
                      }}
                    />
                  </View>
                </>
              ) : null}

              {suggestedDate && hasEditPermission ? (
                <HeaderThree
                  style={{
                    textAlign: 'center',
                    marginBottom: 20,
                    marginTop: 10,
                  }}
                  text="Om du vill ändra plats gör detta genom att redigera din produkt och uppdatera upphämtningsaddress där."
                />
              ) : null}
              <Divider style={{ marginTop: 10 }} />

              <View style={styles.actionButtons}>
                {suggestedDate ? (
                  <>
                    {hasEditPermission || isReservedUser || isOrganisedUser ? (
                      <ButtonAction
                        buttonColor={Colors.darkRed}
                        onSelect={() => {
                          resetSuggestedDT();
                        }}
                        title="Annan tid"
                      />
                    ) : null}
                    {!sellerAgreed && hasEditPermission ? (
                      <ButtonAction
                        buttonColor={Colors.approved}
                        buttonLabelStyle={{ color: '#fff' }}
                        onSelect={() => {
                          approveSuggestedDateTime(suggestedDate);
                        }}
                        title="Godkänn förslag"
                      />
                    ) : null}
                    {!buyerAgreed && (isReservedUser || isOrganisedUser) ? (
                      <ButtonAction
                        buttonColor={Colors.approved}
                        buttonLabelStyle={{ color: '#fff' }}
                        onSelect={() => {
                          approveSuggestedDateTime(suggestedDate);
                        }}
                        title="Godkänn förslag"
                      />
                    ) : null}
                    {isReservedUser ? (
                      <ButtonAction
                        buttonColor={Colors.subtleRed}
                        buttonLabelStyle={{ color: '#fff' }}
                        disabled={isPickedUp}
                        onSelect={unReserveHandler}
                        title="avreservera"
                      />
                    ) : null}
                  </>
                ) : null}
              </View>
            </>
          ) : null}

          {collectingDate && (hasEditPermission || isReservedUser || isOrganisedUser) ? (
            <>
              <Divider style={{ marginBottom: 10 }} />
              <View style={[styles.box, { backgroundColor: Colors.subtleBlue }]}>
                <HeaderThree
                  style={styles.boxText}
                  text={`Överenskommen tid: ${moment(collectingDate)
                    .locale('sv')
                    .format('D MMMM, HH:mm')}`}
                />
                <HeaderThree style={styles.boxText} text={`Plats: ${address}`} />
              </View>
              <Divider style={{ marginTop: 10 }} />

              <View style={styles.actionButtons}>
                <ButtonAction
                  buttonColor={Colors.darkRed}
                  onSelect={() => {
                    resetSuggestedDT();
                  }}
                  title="Ändra tid"
                />
                {hasEditPermission ? (
                  <ButtonAction
                    buttonColor={Colors.approved}
                    buttonLabelStyle={{ color: '#fff' }}
                    disabled={isPickedUp}
                    onSelect={collectHandler.bind(this)}
                    title="Byt till hämtad"
                  />
                ) : null}
              </View>
              <Divider />
            </>
          ) : null}

          {isReserved &&
          !isOrganised &&
          !hasEditPermission &&
          !isReservedUser &&
          !isOrganisedUser ? (
            <HeaderThree
              style={{ textAlign: 'center', marginBottom: 20 }}
              text="Parterna är i processen att ordna med logistik"
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
};

const styles = StyleSheet.create({
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  box: {
    alignSelf: 'center',
    padding: 6,
  },
  boxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  oneLineSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerOptions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 80,
  },
  receivingOptions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    height: 80,
  },
  smallBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    height: 17,
    paddingHorizontal: 2,
    right: -10,
    zIndex: 10,
  },
  smallText: {
    color: '#fff',
    fontSize: 10,
    padding: 2,
    textTransform: 'uppercase',
  },
  textAndBadge: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ProductButtonLogic;
