import React from 'react';
import { Avatar, Badge } from 'react-native-paper';
import { useSelector } from 'react-redux';

import TouchableCmp from './TouchableCmp';

const UserAvatar = ({ userId, actionOnPress, style, size, showBadge }) => {
  //Get logged in userId from state, and products
  let currentProfile = useSelector((state) => state.profiles.userProfile || {});
  //If we are passing a userId, use this as the current user, else use the currently logged in user
  if (userId) {
    currentProfile = useSelector((state) =>
      state.profiles.allProfiles.find((prof) => prof.profileId === userId)
    );
  }

  const loggedInUserId = currentProfile.profileId;

  const allOrders = useSelector((state) => state.orders.availableOrders);
  const ordersFromUser = allOrders.filter((order) => order.sellerId === loggedInUserId);
  const ordersByUser = useSelector((state) => state.orders.userOrders);

  const badgeNumber = ordersByUser.length + ordersFromUser.length;

  return (
    <TouchableCmp
      activeOpacity={0.5}
      onPress={actionOnPress}
      style={
        style
          ? style
          : {
              marginHorizontal: 10,
              marginTop: 40,
            }
      }>
      <Avatar.Image
        style={{
          color: '#fff',
          backgroundColor: '#fff',
          borderWidth: 0.5,
          borderColor: '#666',
        }}
        source={
          currentProfile && currentProfile.image
            ? { uri: currentProfile.image }
            : require('./../../assets/avatar-placeholder-image.png')
        }
        size={size ? size : 40}
      />
      {showBadge && badgeNumber > 0 ? (
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
