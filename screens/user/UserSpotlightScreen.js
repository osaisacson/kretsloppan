import React from 'react';
import { View, Image } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ButtonIcon from '../../components/UI/ButtonIcon';
import Colors from '../../constants/Colors';
import ScrollViewToTop from './../../components/wrappers/ScrollViewToTop';
import UserItems from './UserItems';
import { userProfileStyles } from './UserProfile';

const UserSpotlightScreen = (props) => {
  //TBD: Find a better solution for this. Currently the user object does not update if we don't pull in all profiles
  const currentProfileForId = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfileForId.profileId;
  const currentProfile = useSelector((state) =>
    state.profiles.allProfiles.find((profile) => profile.profileId === loggedInUserId)
  );

  //Gets all products
  const availableProducts = useSelector((state) => state.products.availableProducts);

  //Gets all products by the logged in user
  const userProducts = availableProducts.filter((prod) => prod.ownerId === loggedInUserId);

  //Gets all orders by the logged in user
  const userOrders = useSelector((state) => state.orders.userOrders);

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector((state) => state.projects.availableProjects).filter(
    (proj) => proj.ownerId === loggedInUserId
  );

  //Get user proposals
  const availableProposals = useSelector((state) => state.proposals.availableProposals);
  const userProposalsRaw = availableProposals.filter(
    (proposal) => proposal.ownerId === loggedInUserId
  );
  const userProposals = userProposalsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  //Sets indicator numbers
  const added = userProducts.length;
  const collected = userOrders.length;
  const nrOfProjects = userProjects.length;

  //Navigate to the edit screen and forward the product id
  const editProfileHandler = () => {
    props.navigation.navigate('EditProfile', { detailId: currentProfile.id });
  };

  return (
    <>
      <ScrollViewToTop>
        <View style={userProfileStyles.userInfoSection}>
          <Image
            source={require('./../../assets/userBackground.png')}
            style={{
              flex: 1,
              resizeMode: 'cover',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '105%',
            }}
          />
          <Avatar.Image
            style={{
              marginTop: 5,
              color: '#fff',
              backgroundColor: '#fff',
              borderWidth: 0.3,
              borderColor: '#000',
            }}
            source={
              currentProfile && currentProfile.image
                ? { uri: currentProfile.image }
                : require('./../../assets/avatar-placeholder-image.png')
            }
            size={80}
          />
          <ButtonIcon icon="settings" color={Colors.neutral} onSelect={editProfileHandler} />

          <Title style={{ color: '#fff', ...userProfileStyles.title }}>
            {currentProfile.profileName}
          </Title>
          {currentProfile.location ? (
            <Title
              style={{
                color: '#fff',
                fontFamily: 'roboto-bold-italic',
                ...userProfileStyles.subtitle,
              }}>
              {currentProfile.location}
            </Title>
          ) : null}
          {currentProfile.profileDescription ? (
            <Title style={{ color: '#fff', ...userProfileStyles.subtitle }}>
              {currentProfile.profileDescription}
            </Title>
          ) : null}
          <View style={userProfileStyles.row}>
            <View style={userProfileStyles.section}>
              <Paragraph style={{ color: '#fff', ...userProfileStyles.paragraph }}>
                {added ? added : 0}
              </Paragraph>
              <Caption style={{ color: '#fff' }}>Upplagda</Caption>
            </View>
            <View style={userProfileStyles.section}>
              <Paragraph style={{ color: '#fff', ...userProfileStyles.paragraph }}>
                {collected ? collected : 0}
              </Paragraph>
              <Caption style={{ color: '#fff' }}>Köpta</Caption>
            </View>

            <View style={userProfileStyles.section}>
              <Paragraph style={{ color: '#fff', ...userProfileStyles.paragraph }}>
                {nrOfProjects ? nrOfProjects : 0}
              </Paragraph>
              <Caption style={{ color: '#fff' }}>Projekt</Caption>
            </View>
          </View>
        </View>

        <UserItems
          userProjects={userProjects}
          userProposals={userProposals}
          userProducts={userProducts}
          loggedInUserId={loggedInUserId}
          navigation={props.navigation}
        />
      </ScrollViewToTop>
    </>
  );
};

export default UserSpotlightScreen;
