import moment from 'moment/min/moment-with-locales';
import React, { useState, useCallback } from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useColorScheme } from 'react-native-appearance';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import AnimatedButton from '../../components/UI/AnimatedButton';
import ButtonAction from '../../components/UI/ButtonAction';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import ProductStatusCopy from '../../components/UI/ProductStatusCopy';
import RoundItem from '../../components/UI/RoundItem';
import SmallRoundItem from '../../components/UI/SmallRoundItem';
import UserAvatar from '../../components/UI/UserAvatar';
import { detailStyles } from '../../components/wrappers/DetailWrapper';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const ProductButtonLogic = (props) => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Set up state hooks
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [suggestedDateLocal, setSuggestedDateLocal] = useState();

  //Get all projects from state, and then return the ones that matches the id of the current product
  const availableProjects = useSelector((state) => state.projects.availableProjects);
  const userProjects = availableProjects.filter((project) => project.ownerId === loggedInUserId);

  const {
    id,
    projectId,
    status,
    ownerId,
    reservedUserId,
    collectingUserId,
    newOwnerId,
    suggestedDate,
    collectingDate,
    phone,
    address,
    sellerAgreed,
    buyerAgreed,
    pickupDetails,
    category,
    condition,
    style,
    material,
    color,
    title,
    image,
    description,
    background,
    length,
    height,
    width,
    price,
    priceText,
    internalComments,
  } = props.selectedProduct;

  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const hasEditPermission = props.hasEditPermission;
  const isSellerOrBuyer = hasEditPermission || isReservedUser || isOrganisedUser;
  const showButtons = isSellerOrBuyer && (isReserved || isOrganised);

  //Will change based on where we are in the reservation process
  let receivingId = '';
  let buttonCopy = 'Se detaljer';
  const statusColor = Colors.darkPrimary;

  if (isReserved) {
    receivingId = reservedUserId;
    // statusColor = Colors.primary;
  }

  if (isOrganised) {
    receivingId = collectingUserId;
    // statusColor = Colors.subtleGreen;
  }

  if (isPickedUp) {
    receivingId = newOwnerId;
    // statusColor = Colors.completed;
  }

  if (showButtons && !suggestedDate) {
    buttonCopy = 'Föreslå en tid';
  }

  if (showButtons && collectingDate) {
    buttonCopy = 'Se detaljer eller markera som hämtad';
  }

  if (suggestedDate && !sellerAgreed && hasEditPermission) {
    buttonCopy = 'Godkänn/ändra tid';
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
      'Denna reservation gäller i fyra dagar. Nästa steg är att föreslå en upphämtningstid och om det behövs kontakta säljaren för att diskutera detaljer. Du hittar alltid reservationen under din profil.',
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
      'Genom att klicka här ställer du in den föreslagna tiden. Ni får då igen fyra dagar på er att komma överens om en tid.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            dispatch(
              productsActions.changeProductStatus(
                id,
                'reserverad',
                checkedProjectId,
                prevReservedUser
              ) //by default resets the date to expire in four days, since the status is 'reserved'
            ).then(setIsLoading(false));
            setSuggestedDateLocal();
            setShowUserProjects(false);
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
          },
        },
      ]
    );
  };

  const collectHandler = () => {
    Alert.alert(
      'Är produkten hämtad?',
      'Genom att klicka här bekräftar du att produkten är hämtad.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Japp, den är hämtad!',
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
    <>
      <View style={[styles.oneLineSpread, { marginBottom: 6, marginTop: 10 }]}>
        <View style={[styles.textAndBadge, { justifyContent: 'flex-start' }]}>
          <HeaderAvatar profileId={ownerId} navigation={props.navigation} />
          <View style={[styles.smallBadge, { backgroundColor: statusColor, left: -10 }]}>
            <Text style={styles.smallText}>säljare</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            right: 0,
          }}>
          {receivingProfile ? (
            <View style={[styles.textAndBadge, { justifyContent: 'flex-end' }]}>
              <View style={[styles.smallBadge, { backgroundColor: statusColor, right: -10 }]}>
                <Text style={styles.smallText}>köpare</Text>
              </View>
              <HeaderAvatar profileId={receivingId} navigation={props.navigation} />
              {projectForProduct ? (
                <>
                  <View style={{ marginLeft: -20, zIndex: -1 }}>
                    <SmallRoundItem
                      detailPath="ProjectDetail"
                      item={projectForProduct}
                      navigation={props.navigation}
                    />
                  </View>
                </>
              ) : null}
            </View>
          ) : null}
          {!hasEditPermission && !isReserved && !isPickedUp && !isOrganised ? (
            <ButtonAction disabled={isReserved} onSelect={toggleReserveButton} title="reservera" />
          ) : null}
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.lightPrimary,
          borderWidth: 0.5,
          borderColor: '#000',
          borderRadius: 5,
          padding: 5,
        }}>
        <View>
          <ProductStatusCopy
            style={{ textAlign: 'center' }}
            selectedProduct={props.selectedProduct}
          />
          {!isPickedUp ? <AnimatedButton onPress={toggleShowOptions} text={buttonCopy} /> : null}
        </View>
        {/* When trying to reserve, open this up for selection of associated project */}
        {showUserProjects ? (
          <>
            <HeaderThree
              text="Vilket projekt ska återbruket användas i?"
              style={detailStyles.centeredHeader}
            />

            <HorizontalScrollContainer>
              <RoundItem
                itemData={{
                  image: './../../assets/avatar-placeholder-image.png',
                  title: 'Inget projekt',
                }}
                key="000"
                isHorizontal
                onSelect={() => {
                  reserveHandler('000');
                }}
              />
              {userProjects.map((item) => (
                <RoundItem
                  itemData={item}
                  key={item.id}
                  isHorizontal
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
                <Text>{phone ? `0${phone}` : 'Ingen telefon angiven'}</Text>
                {address ? <Text>{address ? address : 'Ingen address angiven'}</Text> : null}
                {pickupDetails ? (
                  <View style={styles.pickupDetails}>
                    <HeaderThree text="Upphämtningsdetaljer: " />
                    <Text>{pickupDetails}</Text>
                  </View>
                ) : null}
              </View>

              {receivingProfile ? (
                <View style={styles.receivingOptions}>
                  <Text>{receivingProfile.profileName}</Text>
                  <Text>
                    {receivingProfile.phone ? receivingProfile.phone : 'Ingen telefon angiven'}
                  </Text>
                  {receivingProfile.address ? (
                    <Text style={{ textAlign: 'right' }}>
                      {receivingProfile.address
                        ? receivingProfile.address
                        : 'Ingen address angiven'}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>

            {/* Show a prompt if the product has not yet sorted logistics, and if the viewer is any of the involved parties  */}
            {isReserved && isSellerOrBuyer ? (
              <>
                {!suggestedDate ? (
                  <>
                    <Divider style={{ marginBottom: 10 }} />
                    <HeaderThree
                      style={{ textAlign: 'center', marginBottom: 10 }}
                      text="Föreslå tid för upphämtning nedan."
                    />
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
                        styleWeekend
                        onDateSelected={(date) => {
                          handleTimePicker(date);
                        }}
                        style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
                        type="border"
                        borderWidth={1}
                        borderHighlightColor="#666"
                      />
                      <DateTimePickerModal
                        date={new Date(suggestedDateLocal)}
                        isDarkModeEnabled={colorScheme === 'dark'}
                        cancelTextIOS="Avbryt"
                        confirmTextIOS="Klar!"
                        headerTextIOS={`Valt datum ${moment(suggestedDateLocal)
                          .locale('sv')
                          .format('D MMMM')}. Välj tid:`}
                        isVisible={showTimePicker}
                        mode="time"
                        locale="sv_SV" // Use "en_GB" here
                        onConfirm={(dateTime) => {
                          sendSuggestedDT(dateTime);
                        }}
                        onCancel={hideTimePicker}
                      />
                    </View>

                    <HeaderThree
                      style={{ textAlign: 'center' }}
                      text="...kontakta varandra via detaljerna ovan om ni har frågor, annars är det ovan tid och plats som gäller."
                    />
                  </>
                ) : null}

                {suggestedDate && hasEditPermission ? (
                  <HeaderThree
                    style={{
                      textAlign: 'center',
                      marginBottom: 20,
                      marginTop: 10,
                    }}
                    text="TIPS: Om du vill ändra plats gör detta genom att redigera din produkt och uppdatera upphämtningsaddress där."
                  />
                ) : null}
              </>
            ) : null}

            {showButtons && (suggestedDate || collectingDate) ? <Divider /> : null}

            {suggestedDate && isSellerOrBuyer ? (
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'roboto-light-italic',
                    color: Colors.darkPrimary,
                  }}>
                  Föreslagen tid
                </Text>
                <Text
                  style={{ fontSize: 15, fontFamily: 'roboto-bold', color: Colors.darkPrimary }}>
                  {moment(suggestedDate).locale('sv').format('D MMMM, HH:MM')}
                </Text>
              </View>
            ) : null}
            <View style={styles.actionButtons}>
              {collectingDate && isSellerOrBuyer ? (
                <>
                  <ButtonAction
                    buttonColor={Colors.subtleGrey}
                    title="Ändra tid"
                    onSelect={() => {
                      resetSuggestedDT();
                    }}
                  />
                  <Animatable.View
                    animation="pulse"
                    easing="ease-out"
                    duration={1000}
                    iterationCount="infinite">
                    <ButtonAction
                      disabled={isPickedUp}
                      buttonColor={Colors.approved}
                      buttonLabelStyle={{ color: '#fff' }}
                      title="hämtad!"
                      onSelect={collectHandler.bind(this)}
                    />
                  </Animatable.View>
                </>
              ) : null}
              {suggestedDate ? (
                <>
                  {isSellerOrBuyer ? (
                    <ButtonAction
                      buttonColor={Colors.subtleGrey}
                      title="Annan tid"
                      onSelect={() => {
                        resetSuggestedDT();
                      }}
                    />
                  ) : null}
                  {!sellerAgreed && hasEditPermission ? (
                    <Animatable.View
                      animation="pulse"
                      easing="ease-out"
                      duration={1000}
                      iterationCount="infinite">
                      <ButtonAction
                        buttonLabelStyle={{ color: '#fff' }}
                        buttonColor={Colors.approved}
                        title="Godkänn förslag"
                        onSelect={() => {
                          approveSuggestedDateTime(suggestedDate);
                        }}
                      />
                    </Animatable.View>
                  ) : null}
                  {!buyerAgreed && (isReservedUser || isOrganisedUser) ? (
                    <ButtonAction
                      buttonLabelStyle={{ color: '#fff' }}
                      buttonColor={Colors.approved}
                      title="Godkänn förslag"
                      onSelect={() => {
                        approveSuggestedDateTime(suggestedDate);
                      }}
                    />
                  ) : null}

                  {isReservedUser || hasEditPermission ? (
                    <ButtonAction
                      disabled={isPickedUp}
                      buttonColor={Colors.subtleGrey}
                      buttonLabelStyle={{ color: '#fff' }}
                      onSelect={unReserveHandler}
                      title="avreservera"
                    />
                  ) : null}
                </>
              ) : null}
            </View>

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
    </>
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
  },
  pickupDetails: {
    paddingVertical: 8,
  },
  receivingOptions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingBottom: 5,
  },
  oneLineRight: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'right',
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
  },
  smallBadge: {
    zIndex: 10,
    paddingHorizontal: 2,
    borderRadius: 5,
    height: 17,
  },
  smallText: {
    textTransform: 'uppercase',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },
  actionButtons: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  box: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  boxText: {
    fontFamily: 'roboto-bold',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default ProductButtonLogic;
