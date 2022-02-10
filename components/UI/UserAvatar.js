import React from 'react';
import { View } from 'react-native';
import { useQuery, useMutation, queryCache } from 'react-query';

import { Avatar, Badge } from 'react-native-paper';
import useGetProfile from '../../hooks/useGetProfile';

import TouchableCmp from './TouchableCmp';

const API_BASE_URL = 'http://localhost:3000';

const UserAvatar = ({ userId, actionOnPress, style, size, showBadge }) => {
  //TODO: make component that shows and indicator with the orders associated with the profile
  //Get product id from route through props
  // const selectedProductId = route.params.itemData.id;
  // const allOrders = useSelector((state) => state.orders.availableOrders);
  // const toSell = allOrders.filter(
  //   (order) => order.sellerId === loggedInUserId && !order.isCollected
  // );
  // const userOrders = useSelector((state) => state.orders.userOrders);
  // const toBuy = userOrders.filter(
  //   (order) => order.buyerId === loggedInUserId && !order.isCollected
  // );

  // const badgeNumber = toBuy.length + toSell.length;
  //If we are passing an id get the profile for this user, else use the id of the currently logged in user

  // const { isLoading, isError, data, error } = useGetProfile(userId);

  // const [image, setImage] = useState(
  //   data.image ? { uri: data.image } : require('./../../assets/icon.png')
  // );

  // if (data.image) {
  //   setImage({ uri: data.image });
  // }

  //Show a white image when the image is Loading, or if the profile image does not exist.
  // if (isError || isLoading || !data || !data.image) {
  //   isError ? console.log('ERROR: ', error.message) : `Loading profile with id ${userId}...`;

  //   return (
  //     <View
  //       style={
  //         style
  //           ? style
  //           : {
  //               marginHorizontal: 10,
  //               marginTop: 40,
  //             }
  //       }>
  //       <Avatar.Image
  //         style={{
  //           color: '#fff',
  //           backgroundColor: 'transparent',
  //           borderWidth: 0.5,
  //           borderColor: '#666',
  //         }}
  //         size={size ? size : 40}
  //       />
  //     </View>
  //   );
  // }

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
        source={require('./../../assets/icon.png')}
        size={size ? size : 40}
      />
      {/* {showBadge && badgeNumber > 0 ? (
        <Badge
          style={{
            fontWeight: 'bold',
            position: 'relative',
            bottom: 20,
          }}>
          {badgeNumber}
        </Badge>
      ) : null} */}
    </TouchableCmp>
  );
};

export default UserAvatar;
