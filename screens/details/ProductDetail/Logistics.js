import moment from 'moment/min/moment-with-locales';
import React, { useState, useRef } from 'react';
import { View, Alert, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';

import ButtonConfirm from '../../../components/UI/ButtonConfirm';
import CalendarSelection from '../../../components/UI/CalendarSelection';
import HeaderThree from '../../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../../components/UI/HorizontalScrollContainer';
import RoundItem from '../../../components/UI/RoundItem';
import RoundItemEmpty from '../../../components/UI/RoundItemEmpty';
import UserAvatar from '../../../components/UI/UserAvatar';
import { detailStyles } from '../../../components/wrappers/DetailWrapper';
import Colors from '../../../constants/Colors';
import * as ordersActions from '../../../store/actions/orders';
import * as productsActions from '../../../store/actions/products';

const Logistics = ({ navigation, hasEditPermission, selectedProduct }) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get('window').height;

  const [orderProject, setOrderProject] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuggestedDate, setOrderSuggestedDate] = useState();

  const { id, image, amount, ownerId, suggestedDate, sold } = selectedProduct;

  const productOrders = useSelector((state) =>
    state.orders.availableOrders.filter((order) => order.productId === id)
  );

  const allOrdersCollected = productOrders.every((order) => order.isCollected);
  const allSold = amount === sold && allOrdersCollected;
  const allReserved = amount > sold && !allOrdersCollected;
  const canBeReserved = !allReserved && !allSold;

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Get all projects from state, and then return the ones that matches the id of the current product
  const availableProjects = useSelector((state) => state.projects.availableProjects);
  const userProjects = availableProjects.filter((project) => project.ownerId === loggedInUserId);

  const toggleBottomModal = () => {
    refRBSheet.current.open();
  };

  const reserveHandler = (id, ownerId, orderProjectId, quantity, orderSuggestedDate) => {
    console.log({ id, ownerId, orderProjectId, quantity, orderSuggestedDate });
    const imageUrl = image;
    const quantityNum = Number(quantity);
    const newProductAmount = amount - quantityNum;
    console.log('Logistics/reserveHandler: newProductAmount', newProductAmount);

    if (!quantity || !orderSuggestedDate) {
      Alert.alert(
        'Å Nej!',
        'Det ser ut som du antingen inte valt hur många du vill boka eller inte föreslagit en upphämtningstid.',
        [{ text: 'Ok' }]
      );
      return false;
    }

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
              ordersActions.createOrder(
                id,
                ownerId,
                orderProjectId,
                imageUrl,
                quantityNum,
                orderSuggestedDate
              )
            );
            dispatch(productsActions.updateProductAmount(id, newProductAmount));
            refRBSheet.current.close();
          },
        },
      ]
    );
  };

  const sendSuggestedTime = (dateTime) => {
    console.log(
      'Logistics/sendSuggestedTime: attempting to set the selected dateTime in parent to: ',
      dateTime
    );
    setOrderSuggestedDate(dateTime);
  };

  return (
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
        <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -10 }]}>
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
        {/* Reserve item - visible to all except the creator of the item, as long as there are any left*/}
        {!hasEditPermission && canBeReserved ? (
          <View>
            <ButtonConfirm onSelect={toggleBottomModal} title="reservera"/>
            <RBSheet
              ref={refRBSheet}
              height={windowHeight - 80}
              closeOnPressBack
              closeOnDragDown
              closeOnPressMask>
              <ScrollView>
                {/* If the user has any projects, ask which project the item will be used in  */}
                {userProjects.length ? (
                  <>
                    <HeaderThree
                      text="Vilket projekt ska återbruket användas i?"
                      style={detailStyles.centeredHeader}
                    />
                    <HorizontalScrollContainer scrollHeight={120}>
                      <RoundItemEmpty
                        isSelected={orderProject === ''}
                        title="Inget"
                        key="1"
                        isHorizontal
                        onSelect={() => {
                          setOrderProject('');
                        }}
                      />
                      {userProjects.map((item) => (
                        <RoundItem
                          isSelected={orderProject === item.id}
                          itemData={item}
                          key={item.id}
                          isHorizontal
                          onSelect={() => {
                            setOrderProject(item.id);
                          }}
                        />
                      ))}
                    </HorizontalScrollContainer>
                    <Divider />
                  </>
                ) : null}

                {/* If there are multiple items available to reserve, ask how many the user wants to reserve */}
                {amount > 1 ? (
                  <>
                    <HeaderThree
                      text="Hur många vill du reservera?"
                      style={detailStyles.centeredHeader}
                    />
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Text style={{ fontSize: 20, paddingTop: 5 }}>{orderQuantity}</Text>
                      <Slider
                        style={{ width: 200, height: 40 }}
                        minimumValue={1}
                        step={1}
                        maximumValue={amount}
                        minimumTrackTintColor={Colors.subtleGreen}
                        maximumTrackTintColor="#000000"
                        value={orderQuantity.toString()}
                        onSlidingComplete={(value) => setOrderQuantity(value)}
                      />
                    </View>
                  </>
                ) : null}

                {/* Set a date and time for pickup */}
                <CalendarSelection
                  suggestedDate={suggestedDate}
                  sendSuggestedTime={sendSuggestedTime}
                />
                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                  <Text>{orderQuantity ? `Antal: ${orderQuantity}` : null}</Text>
                  <Text>
                    {orderSuggestedDate
                      ? `Föreslaget upphämtningsdatum: ${moment(orderSuggestedDate)
                          .locale('sv')
                          .format('D MMM YYYY, HH:mm')}`
                      : null}
                  </Text>
                </View>
                <ButtonConfirm
                  disabled={allReserved}
                  style={{ backgroundColor: Colors.primary, borderRadius: 5, padding: 20 }}
                  onSelect={() => {
                    reserveHandler(id, ownerId, orderProject, orderQuantity, orderSuggestedDate);
                  }}
                  title={ allReserved ? "alla reserverade" : "reservera"}
                />
              </ScrollView>
            </RBSheet>
          </View>
        ) : null}
      </View>
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
