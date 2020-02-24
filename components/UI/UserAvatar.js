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

  const userProducts = useSelector(state => state.products.userProducts);

  //Gets nr of all booked products
  const bookedUserProductsNr = userProducts.filter(
    product => product.status === 'reserverad'
  ).length;

  //Gets nr of all currently being worked on products
  const inProgressUserProductsNr = userProducts.filter(
    product => product.status === 'bearbetas'
  ).length;

  //Gets nr of all wanted products
  const wantedUserProductsNr = userProducts.filter(
    product => product.status === 'efterlyst'
  ).length;

  const activeBadgeNr =
    bookedUserProductsNr + inProgressUserProductsNr + wantedUserProductsNr;

  return (
    <TouchableCmp
      activeOpacity={0.5}
      onPress={props.actionOnPress}
      style={{ margin: 10, paddingTop: 20 }}
    >
      <Avatar.Image
        style={{
          color: '#fff',
          backgroundColor: '#fff',
          borderWidth: '0.3',
          borderColor: '#000'
        }}
        source={require('./../../assets/egnahemsfabriken.png')}
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
