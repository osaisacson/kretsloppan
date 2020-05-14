import React from 'react';
import { useSelector } from 'react-redux';

//Components
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { Avatar, Badge } from 'react-native-paper';

const UserAvatar = (props) => {
  //Get logged in userId from state and all reserved products
  const loggedInUserId = useSelector((state) => state.auth.userId);

  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const userProducts = useSelector((state) => state.products.userProducts);

  const reservedProducts = availableProducts.filter(
    (product) =>
      product.status === 'reserverad' &&
      product.reservedUserId === loggedInUserId
  );

  const userReservedProductsNr =
    reservedProducts && reservedProducts.length > 0
      ? reservedProducts.length
      : 0;

  const otherProducts = userProducts.filter(
    (product) => product.status === 'reserverad'
  );

  const othersReservedProductsNr =
    otherProducts && otherProducts.length > 0 ? otherProducts.length : 0;

  //If we are passing a userId, use this as the current user, else use the currently logged in user
  const currentUser = useSelector((state) =>
    state.profiles.allProfiles.find((prof) =>
      props.userId
        ? prof.profileId === props.userId
        : prof.profileId === loggedInUserId
    )
  );

  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    <TouchableCmp
      activeOpacity={0.5}
      onPress={props.actionOnPress}
      style={
        props.style
          ? props.style
          : {
              marginHorizontal: 10,
              marginTop: 40,
            }
      }
    >
      <View>
        <Avatar.Image
          style={{
            color: '#fff',
            backgroundColor: '#fff',
            borderWidth: 0.3,
            borderColor: '#000',
          }}
          source={
            currentUser && currentUser.image
              ? { uri: currentUser.image }
              : require('./../../assets/avatar-placeholder-image.png')
          }
          size={40}
        />
        {props.showBadge ? (
          <Badge
            style={{
              fontWeight: 'bold',
              position: 'relative',
              bottom: 20,
            }}
          >
            {userReservedProductsNr + othersReservedProductsNr}
          </Badge>
        ) : null}
      </View>
    </TouchableCmp>
  );
};

export default UserAvatar;
