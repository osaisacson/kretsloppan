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
  //Get userProducts and logged in userId from state
  const userProducts = useSelector((state) => state.products.userProducts);
  const loggedInUserId = useSelector((state) => state.auth.userId);

  //Find the profile that matches the id of the currently logged in User
  const currentUser = useSelector((state) =>
    state.profiles.allProfiles.find((prof) => prof.profileId === loggedInUserId)
  );

  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  //Gets nr of all booked products
  const bookedUserProducts = userProducts.filter(
    (product) => product.status === 'reserverad'
  );

  const bookedUserProductsNr =
    bookedUserProducts && bookedUserProducts.length > 0
      ? bookedUserProducts.length
      : 0;

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
            currentUser
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
            {bookedUserProductsNr}
          </Badge>
        ) : null}
      </View>
    </TouchableCmp>
  );
};

export default UserAvatar;
