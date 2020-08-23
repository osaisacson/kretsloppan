import React, { useState, useRef } from 'react';
import { View, Alert, Text, StyleSheet, Slider } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';

import ButtonAction from '../../../components/UI/ButtonAction';
import CalendarSelection from '../../../components/UI/CalendarSelection';
import HeaderThree from '../../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../../components/UI/HorizontalScrollContainer';
import RoundItem from '../../../components/UI/RoundItem';
import UserAvatar from '../../../components/UI/UserAvatar';
import { detailStyles } from '../../../components/wrappers/DetailWrapper';
import Colors from '../../../constants/Colors';
import * as ordersActions from '../../../store/actions/orders';
import * as productsActions from '../../../store/actions/products';

const Logistics = ({ navigation, hasEditPermission, selectedProduct }) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();

  const [orderProject, setOrderProject] = useState('000');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderSuggestedDate, setOrderSuggestedDate] = useState();
  console.log('ORDER QUANTITY: ', orderQuantity);
  console.log('ORDER SUGGESTED DATE: ', orderSuggestedDate);

  const { id, image, amount, ownerId, suggestedDate } = selectedProduct;

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
    const imageUrl = image;
    const quantityNum = Number(quantity);
    const newProductAmount = amount - quantityNum;
    console.log('Logistics/reserveHandler: newProductAmount', newProductAmount);

    if (!quantity || !suggestedDate) {
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
              ),
              dispatch(productsActions.updateProductAmount(id, newProductAmount))
            );
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
                      value={String(orderQuantity)}
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
              <ButtonAction
                style={{ marginBottom: 80 }}
                onSelect={() => {
                  reserveHandler(id, ownerId, orderProject, orderQuantity, orderSuggestedDate);
                }}
                title="reservera"
              />
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
