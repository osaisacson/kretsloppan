import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ButtonToggle from '../../components/UI/ButtonToggle';

import {
  DetailWrapper,
  detailStyles
} from '../../components/wrappers/DetailWrapper';

//Actions
import * as profilesActions from '../../store/actions/products';

const ProfileDetailScreen = props => {
  const [toggleDetails, setToggleDetails] = useState(true);

  //Find the profile which matches the id we passed on clicking to the detail
  const selectedProfileId = props.route.params.detailId;
  const selectedProfile = useSelector(state =>
    state.profiles.allProfiles.find(prof => prof.id === selectedProfileId)
  );

  //Get profiles belonging to the clicked profile
  const allProjects = useSelector(state => state.projects.availableProjects);
  const projectsForProfile = allProjects.filter(
    proj => proj.ownerId === selectedProfile.profileId //check if ownerId matches the saved profileId. Note that for profiles this is different than the id (which is the firebase id, not the actual profile one)
  );

  const dispatch = useDispatch();

  const toggleShowDetails = () => {
    setToggleDetails(prevState => !prevState);
  };

  const deleteHandler = () => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera din profil? Din login kommer fortfarande fungera men all din profildata kommer försvinna.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(profilesActions.deleteProfile(selectedProfileId));
          }
        }
      ]
    );
  };

  return (
    <DetailWrapper>
      <Image
        style={detailStyles.image}
        source={{ uri: selectedProfile.image }}
      />
      <ButtonToggle
        icon="phone"
        title={toggleDetails ? 'Dölj kontaktdetaljer' : 'Visa kontaktdetaljer'}
        onSelect={toggleShowDetails}
      />
      <View style={detailStyles.centeredContent}>
        <Text style={detailStyles.description}>{selectedProfile.name}</Text>
        {/* Only show contact details if toggleDetails is true. TBD: tie this to user options */}
        {toggleDetails ? (
          <>
            <Text style={detailStyles.description}>
              {selectedProfile.email}
            </Text>
            <Text style={detailStyles.description}>
              {selectedProfile.phone}
            </Text>
          </>
        ) : null}
        {projectsForProfile.length > 0 ? (
          <>
            <HorizontalScroll
              title={'Projekt'}
              roundItem={true}
              detailPath={'ProjectDetail'}
              scrollData={projectsForProfile}
              navigation={props.navigation}
            />
          </>
        ) : (
          <Text style={detailStyles.emptyState}>Inga projekt ännu</Text>
        )}
      </View>
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.detailTitle
  };
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%'
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center'
  },
  toggles: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center'
  }
});

export default ProfileDetailScreen;
