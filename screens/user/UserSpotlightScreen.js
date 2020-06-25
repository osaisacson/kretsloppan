import React from 'react';
import { View, Image } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ButtonIcon from '../../components/UI/ButtonIcon';
import Colors from '../../constants/Colors';
import { userProfileStyles } from '../details/UserProfile';
import ScrollViewToTop from './../../components/wrappers/ScrollViewToTop';
import UserActions from './UserActions';
import UserItems from './UserItems';

const UserSpotlightScreen = (props) => {
  //Get profiles, return only the one which matches the logged in id
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Gets all products
  const availableProducts = useSelector((state) => state.products.availableProducts);

  //Gets all products by the logged in user
  const userProducts = availableProducts.filter((prod) => prod.ownerId === loggedInUserId);

  //COLLECTED: Gets all collected products from all products
  const collectedItemsRawAll = availableProducts.filter((product) => product.status === 'hämtad');
  const collectedItemsAll = collectedItemsRawAll.sort(function (a, b) {
    a = new Date(a.collectedDate);
    b = new Date(b.collectedDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  //COLLECTED: Gets all collected products from user products
  const collectedItemsRawUser = userProducts.filter((product) => product.status === 'hämtad');
  const collectedItemsUser = collectedItemsRawUser.sort(function (a, b) {
    a = new Date(a.collectedDate);
    b = new Date(b.collectedDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  //BY USER
  const collectedByUser = collectedItemsAll.filter(
    (product) => product.newOwnerId === loggedInUserId
  );

  //FROM USER
  const givenByUser = collectedItemsUser.filter((product) => product.newOwnerId !== loggedInUserId);

  //READY: Gets all products where the ownerId matches the id of our currently logged in user
  const userUploadsRaw = userProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );
  const userUploads = userUploadsRaw.sort(function (a, b) {
    a = new Date(a.readyDate);
    b = new Date(b.readyDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector((state) => state.projects.availableProjects).filter(
    (proj) => proj.ownerId === loggedInUserId
  );

  //Get user proposals
  const userProposalsRaw = useSelector((state) => state.proposals.userProposals);
  const userProposals = userProposalsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  //Sets indicator numbers
  const added = userProducts.length;
  const collected = collectedByUser.length;
  const sold = givenByUser.length;
  const nrOfProjects = userProjects.length;

  //Navigate to the edit screen and forward the product id
  const editProfileHandler = () => {
    props.navigation.navigate('EditProfile', { detailId: currentProfile.id });
  };

  return (
    <ScrollViewToTop>
      <UserActions navigation={props.navigation} />
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
              {sold ? sold : 0}
            </Paragraph>
            <Caption style={{ color: '#fff' }}>Sålda</Caption>
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
        userUploads={userUploads}
        userProducts={userProducts}
        navigation={props.navigation}
      />
    </ScrollViewToTop>
  );
};

export default UserSpotlightScreen;
