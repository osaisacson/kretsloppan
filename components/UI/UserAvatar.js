import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Avatar, Badge } from 'react-native-paper';

const UserAvatar = props => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }
  return (
    <TouchableCmp activeOpacity={0.5} onPress={props.actionOnPress}>
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
        <Badge style={{ position: 'relative', left: -35, bottom: 20 }}>3</Badge>
      ) : null}
    </TouchableCmp>
  );
};

export default UserAvatar;
