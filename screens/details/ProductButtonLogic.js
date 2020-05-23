import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Alert, Text, StyleSheet } from 'react-native';
import { Button, Divider } from 'react-native-paper';

import moment from 'moment/min/moment-with-locales';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { detailStyles } from '../../components/wrappers/DetailWrapper';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import ButtonAction from '../../components/UI/ButtonAction';
import SmallRoundItem from '../../components/UI/SmallRoundItem';
import RoundItem from '../../components/UI/RoundItem';
import UserAvatar from '../../components/UI/UserAvatar';
import CalendarStrip from 'react-native-calendar-strip';

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
  const [suggestedDT, setSuggestedDT] = useState();

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

  const handleTimePicker = (date) => {
    setSuggestedDateLocal(date);
    setShowTimePicker(true);
  };

  const hideTimePicker = () => {
    setShowTimePicker(false);
  };

  const setTime = (dateTime) => {
    setSuggestedDT(dateTime);
    hideTimePicker();
  };

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
              ) //by default sets the date to be in 24 hours, since the status is 'reserved'
            );
            setSuggestedDateLocal('');
            setSuggestedDT('');
            setShowUserProjects(false);
          },
        },
      ]
    );
  };

  const sendSuggestedDT = (dateTime) => {
    const checkedProjectId = projectId ? projectId : '000';

    Alert.alert(
      'Föreslå tid',
      'Genom att klicka här föreslår du en tid för upphämtning och om motparten godkänner denna åtar du dig att vara på/ plats vid denna tidpunkt. För frågor och andra detaljer kontakta varandra via uppgifterna ovan.',
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
      <UserAvatar
        userId={props.profileId}
        style={[{ margin: 0 }, props.style]}
        showBadge={false}
        actionOnPress={() => {
          props.navigation.navigate('Användare', {
            detailId: props.profileId,
          });
        }}
      />
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View>
      <View style={[styles.oneLineSpread, { marginBottom: 6 }]}>
        <HeaderAvatar profileId={ownerId} navigation={props.navigation} />
        <Button
          color={Colors.darkPrimary}
          style={{ width: 120, position: 'absolute', left: '35%' }}
          icon="unfold-more-horizontal"
          mode="text"
          onPress={toggleShowOptions}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
          }}
        >
          {projectForProduct ? (
            <View style={styles.textAndBadge}>
              <View
                style={[styles.smallBadge, { backgroundColor: statusColor }]}
              >
                <Text style={styles.smallText}>För</Text>
              </View>
              <SmallRoundItem
                detailPath={'ProjectDetail'}
                item={projectForProduct}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {receivingProfile ? (
            <View style={styles.textAndBadge}>
              <View
                style={[styles.smallBadge, { backgroundColor: statusColor }]}
              >
                <Text style={styles.smallText}>Av</Text>
              </View>
              <HeaderAvatar
                profileId={receivingId}
                navigation={props.navigation}
              />
            </View>
          ) : null}
          {!isReserved && !isPickedUp && !isOrganised ? (
            <ButtonAction
              disabled={isReserved}
              onSelect={toggleReserveButton}
              title={'reservera i 24h'}
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
          <Divider style={{ marginBottom: 10 }} />
          <View style={styles.oneLineSpread}>
            <View style={styles.ownerOptions}>
              <Text>{ownerProfile.profileName}</Text>
              <Text>{phone ? phone : 'Ingen telefon angiven'}</Text>
              {address ? (
                <Text>{address ? address : 'Ingen address angiven'}</Text>
              ) : null}
              {hasEditPermission ? (
                <ButtonAction
                  style={{ marginVertical: 10 }}
                  disabled={isPickedUp}
                  buttonColor={Colors.completed}
                  buttonLabelStyle={{ color: '#fff' }}
                  title="Byt till hämtad"
                  onSelect={collectHandler.bind(this)}
                />
              ) : null}
            </View>

            {receivingProfile ? (
              <View style={styles.receivingOptions}>
                <Text>{receivingProfile.profileName}</Text>
                <Text>
                  {receivingProfile.phone
                    ? receivingProfile.phone
                    : 'Ingen telefon angiven'}
                </Text>
                {receivingProfile.address ? (
                  <Text>
                    {receivingProfile.address
                      ? receivingProfile.address
                      : 'Ingen address angiven'}
                  </Text>
                ) : null}
                {isReservedUser ? (
                  <ButtonAction
                    style={{ marginVertical: 10 }}
                    disabled={isPickedUp}
                    buttonColor={Colors.warning}
                    buttonLabelStyle={{ color: '#fff' }}
                    onSelect={unReserveHandler}
                    title={'avreservera'}
                  />
                ) : null}
              </View>
            ) : null}
          </View>
          {/* Show a prompt if the product has not yet sorted logistics, and if the viewer is any of the involved parties  */}
          {isReserved &&
          (hasEditPermission || isReservedUser || isOrganisedUser) ? (
            <>
              <HeaderThree
                style={{ textAlign: 'center', marginBottom: 20 }}
                text={`Kom överens om upphämtning nedan in${moment(
                  reservedUntil
                )
                  .locale('sv')
                  .endOf('hour')
                  .subtract(1, 'hour')
                  .fromNow()}, om ni båda inte kommit överens om en tid innan dess så slutar reservationen gälla. Om inget annat bestäms så hämtas återbruket på given address uppe till vänster vid överenskommen tid.`}
              />
              {!suggestedDate ? (
                <View style={{ flex: 1 }}>
                  <CalendarStrip
                    scrollable
                    selectedDate={suggestedDateLocal}
                    daySelectionAnimation={{
                      type: 'border',
                      borderWidth: 0.5,
                      borderHighlightColor: Colors.darkPrimary,
                      duration: 200,
                    }}
                    highlightDateNameStyle={{ color: Colors.darkPrimary }}
                    highlightDateNumberStyle={{ color: Colors.darkPrimary }}
                    styleWeekend={true}
                    onDateSelected={(date) => {
                      handleTimePicker(date);
                    }}
                    style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
                    type={'border'}
                    borderWidth={1}
                    borderHighlightColor={'#666'}
                  />
                  <DateTimePickerModal
                    date={new Date(suggestedDateLocal)}
                    cancelTextIOS={'Avbryt'}
                    confirmTextIOS={'Klar!'}
                    headerTextIOS={`Valt datum ${moment(suggestedDateLocal)
                      .locale('sv')
                      .format('D MMMM')}. Välj tid:`}
                    isVisible={showTimePicker}
                    mode="time"
                    locale="sv_SV" // Use "en_GB" here
                    onConfirm={(dateTime) => {
                      setTime(dateTime);
                    }}
                    onCancel={hideTimePicker}
                  />
                </View>
              ) : null}

              {suggestedDateLocal && !collectingDate ? (
                <>
                  <HeaderThree
                    style={{ textAlign: 'center' }}
                    text={`Föreslagen tid: ${moment(suggestedDT)
                      .locale('sv')
                      .format('D MMMM, HH:mm')}`}
                  />
                  {suggestedDate ? (
                    <View style={styles.actionButtons}>
                      <ButtonAction
                        style={{ marginRight: 10 }}
                        title={`Godkänn föreslagen tid`}
                        onSelect={() => {
                          approveSuggestedDateTime(suggestedDT);
                        }}
                      />
                      <ButtonAction
                        style={{ marginRight: 10 }}
                        title={`Föreslå annan tid`}
                        onSelect={() => {
                          resetSuggestedDT();
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.actionButtons}>
                      <ButtonAction
                        style={{ marginRight: 10 }}
                        title={'Föreslå denna tid'}
                        onSelect={() => {
                          sendSuggestedDT(suggestedDT);
                        }}
                      />
                    </View>
                  )}
                </>
              ) : null}
              {suggestedDateLocal && collectingDate ? (
                <>
                  <HeaderThree
                    style={{ textAlign: 'center' }}
                    text={`Överenskommen tid: ${moment(collectingDate)
                      .locale('sv')
                      .calendar()}`}
                  />
                  <View style={styles.actionButtons}>
                    <ButtonAction
                      style={{ marginRight: 10 }}
                      title={`Ändra tid`}
                      onSelect={() => {
                        resetSuggestedDT();
                      }}
                    />
                  </View>
                </>
              ) : null}
            </>
          ) : null}

          {isReserved &&
          !isOrganised &&
          !hasEditPermission &&
          !isReservedUser &&
          !isOrganisedUser ? (
            <HeaderThree
              style={{ textAlign: 'center', marginBottom: 20 }}
              text={'Parterna är i processen att ordna med logistik'}
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
    height: 110,
  },
  receivingOptions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    height: 120,
  },
  oneLineRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    right: 0,
  },
  leftTextAndBadge: {
    marginLeft: -10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textAndBadge: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smallBadge: {
    zIndex: 10,
    right: -10,
    paddingHorizontal: 2,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    height: 17,
  },
  smallText: {
    textTransform: 'uppercase',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
});

export default ProductButtonLogic;
