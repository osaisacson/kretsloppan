import moment from 'moment/min/moment-with-locales';
import React, { useState, useRef } from 'react';
import { View, Alert, Text, StyleSheet, TextInput } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';

import ButtonAction from '../../../components/UI/ButtonAction';
import HeaderThree from '../../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../../components/UI/HorizontalScrollContainer';
import Loader from '../../../components/UI/Loader';
import RoundItem from '../../../components/UI/RoundItem';
import UserAvatar from '../../../components/UI/UserAvatar';
import { detailStyles } from '../../../components/wrappers/DetailWrapper';
import Colors from '../../../constants/Colors';
import * as ordersActions from '../../../store/actions/orders';
import * as productsActions from '../../../store/actions/products';

const Logistics = ({ navigation, hasEditPermission, selectedProduct }) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const colorScheme = useColorScheme();

  const [isLoading, setIsLoading] = useState(false);
  const [orderProject, setOrderProject] = useState('000');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuggestedDate, setOrderSuggestedDate] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [suggestedDateLocal, setSuggestedDateLocal] = useState();

  const {
    id,
    amount,
    projectId,
    status,
    ownerId,
    reservedUserId,
    collectingUserId,
  } = selectedProduct;

  ///////////////////////////////START TBD: REMOVE THIS WHEN WE HAVE MIGRATED TO ORDERS INSTEAD OF PRODUCTS
  //Check status of product and privileges of user
  const isReserved = status === 'reserverad';
  const isPickedUp = status === 'hämtad';
  const isReservedUser = reservedUserId === loggedInUserId;
  const isOrganisedUser = collectingUserId === loggedInUserId;
  const isSellerOrBuyer = hasEditPermission || isReservedUser || isOrganisedUser;

  //Will change based on where we are in the reservation process
  const statusColor = Colors.darkPrimary;

  /////////////////////////////// END

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Get all projects from state, and then return the ones that matches the id of the current product
  const availableProjects = useSelector((state) => state.projects.availableProjects);
  const userProjects = availableProjects.filter((project) => project.ownerId === loggedInUserId);

  const toggleBottomModal = () => {
    refRBSheet.current.open();
  };

  const reserveHandler = (id, ownerId, orderProjectId, quantity, suggestedDate) => {
    console.log({ id, ownerId, orderProjectId, quantity, suggestedDate });
    const newProductAmount = amount - quantity;
    console.log('newProductAmount', newProductAmount);

    Alert.alert(
      'Kom ihåg',
      'Denna reservation gäller i fyra dagar. Kontakta säljaren om ni behöver diskutera fler detaljer. Du hittar alltid reservationen under din profil.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              ordersActions.createOrder(id, ownerId, orderProjectId, quantity, suggestedDate),
              productsActions.updateProduct(id, newProductAmount)
            );
            refRBSheet.current.close();
          },
        },
      ]
    );
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
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleTimePicker = (date) => {
    setSuggestedDateLocal(date);
    setShowTimePicker(true);
  };

  const hideTimePicker = () => {
    setShowTimePicker(false);
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
          },
        },
      ]
    );
  };

  const setSuggestedDT = (dateTime) => {
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
            setOrderSuggestedDate(dateTime);
            hideTimePicker();
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
            refRBSheet.current.close();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <View style={[styles.oneLineSpread, { marginBottom: 6, marginTop: 10 }]}>
        <View style={[styles.textAndBadge, { justifyContent: 'flex-start' }]}>
          <UserAvatar
            userId={ownerId}
            style={{ margin: 0 }}
            showBadge={false}
            actionOnPress={() => {
              navigation.navigate('Användare', {
                detailId: ownerId,
              });
            }}
          />
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
          {/* Conditional buttons based on the state of the order - triggers different actions */}

          {/* Reserve item - visible to all except the creator of the item */}
          {!hasEditPermission && amount > 0 ? (
            <View>
              <ButtonAction onSelect={toggleBottomModal} title="reservera" />
              <RBSheet ref={refRBSheet} height={500} closeOnDragDown closeOnPressMask>
                {/* If the user has any projects, ask which project the item will be used in  */}
                {userProjects.length ? (
                  <>
                    <HeaderThree
                      text="Vilket projekt ska återbruket användas i?"
                      style={detailStyles.centeredHeader}
                    />
                    <HorizontalScrollContainer>
                      {userProjects.map((item) => (
                        <RoundItem
                          itemData={item}
                          key={item.id}
                          isHorizontal
                          onSelect={() => {
                            setOrderProject(item.id);
                          }}
                        />
                      ))}
                    </HorizontalScrollContainer>
                  </>
                ) : null}

                {/* If there are multiple items available to reserve, ask how many the user wants to reserve */}
                {amount > 1 ? (
                  <>
                    <HeaderThree
                      text="Hur många vill du reservera?"
                      style={detailStyles.centeredHeader}
                    />
                    <TextInput
                      placeholder={`1 - ${amount}`}
                      style={{
                        margin: 10,
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        width: 100,
                        alignSelf: 'center',
                        textAlign: 'center',
                      }}
                      onChangeText={(text) => setOrderQuantity(text)}
                      value={orderQuantity}
                    />
                  </>
                ) : null}

                {/* Set a date and time for pickup */}
                <>
                  <Divider style={{ marginBottom: 10 }} />
                  <HeaderThree
                    style={{ textAlign: 'center', marginBottom: 10 }}
                    text="Föreslå tid för upphämtning nedan."
                  />
                  <HeaderThree
                    style={{ textAlign: 'center' }}
                    text="...kontakta varandra om ni har frågor, annars är det nedan tid och säljarens givna upphämtingsdetaljer som gäller - hitta dessa i 'upphämtningsdetaljer' ovan."
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
                        setSuggestedDT(dateTime);
                      }}
                      onCancel={hideTimePicker}
                    />
                  </View>
                </>

                <ButtonAction
                  onSelect={() => {
                    reserveHandler(id, ownerId, orderProject, orderQuantity, orderSuggestedDate);
                  }}
                  title="reservera"
                />
              </RBSheet>
            </View>
          ) : null}

          {/* Buttons visible to the seller or buyer after reservation*/}
          {isReserved && isSellerOrBuyer ? (
            <>
              <ButtonAction
                buttonColor={Colors.subtleGrey}
                onSelect={() => {
                  resetSuggestedDT();
                }}
                title="Ändra tid"
              />

              <ButtonAction
                disabled={isPickedUp}
                buttonColor={Colors.approved}
                buttonLabelStyle={{ color: '#fff' }}
                title="hämtad!"
                onSelect={collectHandler.bind(this)}
              />

              <ButtonAction
                buttonLabelStyle={{ color: '#fff' }}
                buttonColor={Colors.approved}
                title="Godkänn förslag"
                onSelect={() => {
                  approveSuggestedDateTime(suggestedDate);
                }}
              />
              <ButtonAction
                disabled={isPickedUp}
                buttonColor={Colors.subtleGrey}
                buttonLabelStyle={{ color: '#fff' }}
                onSelect={unReserveHandler}
                title="avreservera"
              />
            </>
          ) : null}
        </View>
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
});

export default Logistics;
