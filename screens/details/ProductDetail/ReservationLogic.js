import React, { useState, useRef } from 'react';
import { View, Alert, Text, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';

import ButtonConfirm from '../../../components/UI/ButtonConfirm';
import HeaderThree from '../../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../../components/UI/HorizontalScrollContainer';
import RoundItem from '../../../components/UI/RoundItem';
import RoundItemEmpty from '../../../components/UI/RoundItemEmpty';
import UserAvatarWithBadge from '../../../components/UI/UserAvatarWithBadge';
import { detailStyles } from '../../../components/wrappers/DetailWrapper';
import Colors from '../../../constants/Colors';
import * as productsActions from '../../../store/actions/products';
import * as ordersActions from '../../../store/actions/orders';

const ReservationLogic = ({ navigation, hasEditPermission, selectedProduct }) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get('window').height;

  const [orderProject, setOrderProject] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);

  const {
    id,
    image,
    amount,
    ownerId,
    category,
    condition,
    style,
    material,
    color,
    title,
    address,
    location,
    pickupDetails,
    phone,
    description,
    background,
    length,
    height,
    width,
    price,
    priceText,
    internalComments,
    booked,
    sold,
  } = selectedProduct;

  const originalItems = amount === undefined ? 1 : amount;
  const bookedItems = booked || 0;
  const soldItems = sold || 0;

  const allSold = originalItems === soldItems;
  const allReserved = originalItems === bookedItems;

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

  const reserveHandler = (id, quantity) => {
    const quantityBooked = Number(quantity);
    const newBookedProducts =
      (selectedProduct.booked === undefined ? 0 : selectedProduct.booked) + quantityBooked;

    if (!quantity) {
      Alert.alert('Å Nej!', 'Det ser ut som du inte valt hur många du vill boka.', [
        { text: 'Ok' },
      ]);
      return false;
    }

    dispatch(
      ordersActions.createOrder(
        id,
        ownerId,
        loggedInUserId, //id of who initiated the time suggestion, becomes timeInitiatorId
        orderProject,
        image,
        quantityBooked
      )
    );

    dispatch(
      productsActions.updateProduct(
        id,
        category,
        condition,
        style,
        material,
        color,
        title,
        amount,
        image,
        address,
        location,
        pickupDetails,
        phone,
        description,
        background,
        length,
        height,
        width,
        price,
        priceText,
        internalComments,
        newBookedProducts, //updated number for how many products have been booked
        sold
      )
    );
    refRBSheet.current.close();
  };

  return (
    <View style={[styles.oneLineSpread, { marginBottom: 6, marginTop: 10 }]}>
      <UserAvatarWithBadge navigation={navigation} text={'säljare'} detailId={ownerId} />
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
            <ButtonConfirm onSelect={toggleBottomModal} title="reservera" />
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
                {amount - booked > 1 ? (
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
                        maximumValue={amount - booked}
                        minimumTrackTintColor={Colors.subtleGreen}
                        maximumTrackTintColor="#000000"
                        value={orderQuantity.toString()}
                        onSlidingComplete={(value) => setOrderQuantity(value)}
                      />
                    </View>
                  </>
                ) : null}

                <View style={{ alignItems: 'center', marginBottom: 15 }}>
                  <Text>{orderQuantity ? `Antal: ${orderQuantity}` : null}</Text>
                </View>
                <ButtonConfirm
                  style={{ backgroundColor: Colors.completed, borderRadius: 5, padding: 20 }}
                  onSelect={() => {
                    reserveHandler(id, orderQuantity);
                  }}
                  title={'reservera'}
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
});

export default ReservationLogic;
