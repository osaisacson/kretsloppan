import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

//Components
import { View, Text } from 'react-native';
import UserAvatar from './UserAvatar';
import ButtonAction from './ButtonAction';
import { detailStyles } from '../wrappers/DetailWrapper';

const ContactDetails = (props) => {
  const navigation = useNavigation();

  const [toggleDetails, setToggleDetails] = useState(false);

  //Find the profile which matches the id we passed on clicking to the detail
  const profilesArray = useSelector(
    (state) => state.profiles.allProfiles
  ).filter((profile) => profile.profileId === props.profileId);

  const selectedProfile = profilesArray[0];

  const contactEmail =
    selectedProfile && selectedProfile.email
      ? selectedProfile.email
      : 'Ingen email';

  let objectForDetails = selectedProfile;

  //If we are looking at the details for a product, proposal or project, instead show the specific details for this
  if (props.productId) {
    const productArray = useSelector(
      (state) => state.products.availableProducts
    ).filter((prod) => prod.id === props.productId);

    objectForDetails = productArray[0];
  }

  const toggleShowDetails = () => {
    setToggleDetails((prevState) => !prevState);
  };

  return (
    <>
      {props.isProfile ? (
        <ButtonAction
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
            alignItems: 'center',
            marginRight: 5,
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
            <Text
              style={{
                textAlign: 'left',
                fontFamily: 'roboto-regular',
                fontSize: 14,
              }}
            >
              {selectedProfile.profileName}
            </Text>
          </View>
          {props.hideButton ? null : (
            <ButtonAction
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
            : {
                flex: 1,
                marginRight: 5,
                marginVertical: 5,
                alignItems: 'flex-end',
              }
        }
      >
        {/* Contact information */}
        {toggleDetails ? (
          <>
            <View style={detailStyles.textCard}>
              <Text style={detailStyles.oneLiner}>
                {contactEmail ? contactEmail : 'Ingen email angiven'}
              </Text>
            </View>
            <View style={detailStyles.textCard}>
              <Text style={detailStyles.oneLiner}>
                {objectForDetails.phone
                  ? objectForDetails.phone
                  : 'Ingen telefon angiven'}
              </Text>
            </View>
            {objectForDetails.address ? (
              <View style={detailStyles.textCard}>
                <Text style={detailStyles.oneLiner}>
                  {objectForDetails.address
                    ? objectForDetails.address
                    : 'Ingen address angiven'}
                </Text>
              </View>
            ) : null}
            {/* TBD: In-app messaging - Button for passing an object 
            reference to the in-app messaging screen */}
            <ButtonAction
              large={true}
              icon="email"
              title={'Skicka meddelande'} //Send message
              onSelect={() => {}} //Should open the in-app messaging view, forwarding a title to what the message is about: {`Angående: ${objectForDetails.title}`}. Title should in the message link to the post it refers to.
            />
          </>
        ) : null}
      </View>
    </>
  );
};

export default ContactDetails;
