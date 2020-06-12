import React from 'react';
import { Avatar, Badge } from 'react-native-paper';
import { useSelector } from 'react-redux';

import TouchableCmp from './TouchableCmp';

const UserAvatar = (props) => {
  //Get logged in userId from state, and products
  const loggedInUserId = useSelector((state) => state.auth.userId);

  const availableProducts = useSelector((state) => state.products.availableProducts);

  const userProducts = useSelector((state) => state.products.userProducts);

  //Get all products which are reserved by or from the logged in user
  const reservedBy = availableProducts.filter(
    (prod) => prod.status === 'reserverad' && prod.reservedUserId === loggedInUserId
  ).length;

  const reservedFrom = userProducts.filter((prod) => prod.status === 'reserverad').length;

  //Get all products which have a time for collection set, and are pending collection by or for the user
  const collectionBy = availableProducts.filter(
    (prod) => prod.status === 'ordnad' && prod.collectingUserId === loggedInUserId
  ).length;

  const collectionFrom = userProducts.filter((prod) => prod.status === 'ordnad').length;

  const badgeNumber = reservedBy + reservedFrom + collectionBy + collectionFrom;

  //If we are passing a userId, use this as the current user, else use the currently logged in user
  let currentUser;
  if (props.userId) {
    currentUser = useSelector((state) =>
      state.profiles.allProfiles.find((prof) => prof.profileId === props.userId)
    );
  } else {
    currentUser = useSelector((state) => state.profiles.userProfile);
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
      }>
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
      {props.showBadge && badgeNumber > 0 ? (
        <Badge
          style={{
            fontWeight: 'bold',
            position: 'relative',
            bottom: 20,
          }}>
          {badgeNumber}
        </Badge>
      ) : null}
    </TouchableCmp>
  );
};

export default UserAvatar;
