import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

//Components
import { View, Text, Image } from 'react-native';
import UserAvatar from './UserAvatar';
import ButtonToggle from './ButtonToggle';
import { detailStyles } from '../wrappers/DetailWrapper';

const ContactDetails = (props) => {
  const navigation = useNavigation();

  const [toggleDetails, setToggleDetails] = useState(false);

  //Find the profile which matches the id we passed on clicking to the detail
  const profilesArray = useSelector(
    (state) => state.profiles.allProfiles
  ).filter((profile) => profile.profileId === props.profileId);

  const selectedProfile = profilesArray[0];

  const toggleShowDetails = () => {
    setToggleDetails((prevState) => !prevState);
  };

  return (
    <>
      {props.isProfile ? (
        <ButtonToggle
          large={true}
          icon="phone"
          title={toggleDetails ? 'Dölj kontaktdetaljer' : 'kontaktdetaljer'}
          onSelect={toggleShowDetails}
        />
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'left',
            marginBottom: 5,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <UserAvatar
              userId={props.profileId}
              style={{ marginRight: 10, marginLeft: 3 }}
              showBadge={false}
              actionOnPress={() => {
                navigation.navigate('Användare', {
                  detailId: props.profileId,
                });
              }}
            />
            <Text style={detailStyles.largeCenteredHeader}>
              {selectedProfile.profileName}
            </Text>
          </View>
          {props.hideButton ? null : (
            <ButtonToggle
              large={true}
              icon="phone"
              title={
                toggleDetails ? `Dölj ${props.buttonText}` : props.buttonText
              }
              onSelect={toggleShowDetails}
            />
          )}
        </View>
      )}

      <View
        style={
          props.isProfile
            ? detailStyles.centeredContent
            : detailStyles.rightContent
        }
      >
        {/* Only show contact details if toggleDetails is true. TBD: tie this to user options */}
        {toggleDetails ? (
          <>
            <View style={detailStyles.textCard}>
              <Text style={detailStyles.boundaryText}>
                {selectedProfile.email
                  ? selectedProfile.email
                  : 'Inget email angiven'}
              </Text>
            </View>
            <View style={detailStyles.textCard}>
              <Text style={detailStyles.boundaryText}>
                {selectedProfile.phone
                  ? selectedProfile.phone
                  : 'Inget telefon angiven'}
              </Text>
            </View>
            {selectedProfile.address ? (
              <View style={detailStyles.textCard}>
                <Text style={detailStyles.boundaryText}>
                  {selectedProfile.address
                    ? selectedProfile.address
                    : 'Inget address angiven'}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </>
  );
};

export default ContactDetails;
