import React from 'react';
import { View } from 'react-native';
import { Avatar, Badge } from 'react-native-elements';

const UserAvatar = props => {
  return (
    <View>
      <Avatar
        size="medium"
        rounded
        source={{
          uri:
            'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'
        }}
        activeOpacity={0.7}
        onPress={props.actionOnPress}
      />
      {props.showBadge ? (
        <Badge
          value="2"
          status="error"
          containerStyle={{ position: 'relative', left: -20, bottom: 20 }}
        />
      ) : null}
    </View>
  );
};

export default UserAvatar;
