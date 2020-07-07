import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import UserAvatar from './UserAvatar';

const ContactDetails = (props) => {
  const navigation = useNavigation();

  //Find the profile which matches the id we passed on clicking to the detail
  const profile = useSelector((state) =>
    state.profiles.allProfiles.find(({ profileId }) => profileId === props.profileId)
  );

  if (!profile) {
    return null;
  }

  return (
    <View
      style={{
        ...props.style,
        zIndex: 100,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginRight: 5,
      }}>
      <UserAvatar
        userId={props.profileId}
        showBadge={false}
        actionOnPress={() => {
          navigation.navigate('Användare', {
            detailId: props.profileId,
          });
        }}
      />
      {props.showLine ? (
        <Text
          style={{
            marginLeft: 10,
            textAlign: 'left',
            fontFamily: 'roboto-regular',
            fontSize: 14,
          }}>
          {profile.profileName}
        </Text>
      ) : null}
    </View>
  );
};

export default ContactDetails;
