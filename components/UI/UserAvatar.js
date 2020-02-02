import React from 'react';
import { View } from 'react-native';
import { Avatar, Badge } from 'react-native-elements';

const UserAvatar = props => {
  return (
    <View>
      <Avatar
        size="large"
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
          containerStyle={{ position: 'relative', left: -70, bottom: 20 }}
        />
      ) : null}
    </View>
  );
};

export default UserAvatar;
