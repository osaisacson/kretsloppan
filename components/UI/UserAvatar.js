import React from 'react';
import { useSelector } from 'react-redux';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Avatar, Badge } from 'react-native-paper';

const UserAvatar = props => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  const loggedInUserId = useSelector(state => state.auth.userId);

  //Find the profile that matches the id of the currently logged in User
  const currentUser = useSelector(state =>
    state.profiles.allProfiles.find(prof => prof.profileId === loggedInUserId)
  );

  const userProducts = useSelector(state => state.products.userProducts);

  //Gets nr of all booked products
  const bookedUserProducts = userProducts.filter(
    product => product.status === 'reserverad'
  );

  const bookedUserProductsNr =
    bookedUserProducts && bookedUserProducts.length > 0
      ? bookedUserProducts.length
      : 0;

  //Gets nr of all currently being worked on products
  const inProgressUserProducts = userProducts.filter(
    product => product.status === 'bearbetas'
  );

  const inProgressUserProductsNr =
    inProgressUserProducts && inProgressUserProducts.length > 0
      ? inProgressUserProducts.length
      : 0;

  //Gets nr of all wanted products
  const wantedUserProducts = userProducts.filter(
    product => product.status === 'efterlyst'
  );

  const wantedUserProductsNr =
    wantedUserProducts && wantedUserProducts.length > 0
      ? wantedUserProducts.length
      : 0;

  const activeBadgeNr =
    bookedUserProductsNr + inProgressUserProductsNr + wantedUserProductsNr;

  return (
    <TouchableCmp
      activeOpacity={0.5}
      onPress={props.actionOnPress}
      style={{
        marginHorizontal: 10,
        marginTop: 40
      }}
    >
      <Avatar.Image
        style={{
          color: '#fff',
          backgroundColor: '#fff',
          borderWidth: '0.3',
          borderColor: '#000'
        }}
        source={
          currentUser
            ? { uri: currentUser.image }
            : require('./../../assets/avatar-placeholder-image.png')
        }
        size={50}
      />
      {props.showBadge ? (
        <Badge
          style={{
            fontWeight: 'bold',
            position: 'relative',
            left: -35,
            bottom: 20
          }}
        >
          {activeBadgeNr}
        </Badge>
      ) : null}
    </TouchableCmp>
  );
};

export default UserAvatar;
