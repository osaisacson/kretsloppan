import React from 'react';
//Imports
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ContactDetails from '../../components/UI/ContactDetails';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ScrollViewToTop from '../../components/wrappers/ScrollViewToTop';

const UserProfile = (props) => {
  //Get profiles, return only the one which matches the id we pass in route params
  const visitedUserId = props.route.params.detailId;
  const profilesArray = useSelector((state) => state.profiles.allProfiles).filter(
    (profile) => profile.profileId === visitedUserId
  );
  const currentProfile = profilesArray[0];

  //Gets all products for the user we are currently visiting
  const availableProducts = useSelector((state) => state.products.availableProducts);

  const userProducts = availableProducts.filter((product) => product.ownerId === visitedUserId);

  //Gets all proposals for the user we are currently visiting
  const availableProposals = useSelector((state) => state.proposals.availableProposals);

  const userProposalsRaw = availableProposals.filter(
    (proposal) => proposal.ownerId === visitedUserId
  );

  const userProposals = userProposalsRaw.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  //COLLECTED: Gets all collected products from all products
  const collectedItemsRawAll = availableProducts.filter((product) => product.status === 'hämtad');

  const collectedItemsAll = collectedItemsRawAll.sort(function (a, b) {
    return new Date(b.collectedDate) - new Date(a.collectedDate);
  });

  //COLLECTED: Gets all collected products from user products
  const collectedItemsRawUser = userProducts.filter((product) => product.status === 'hämtad');

  const collectedItemsUser = collectedItemsRawUser.sort(function (a, b) {
    return new Date(b.collectedDate) - new Date(a.collectedDate);
  });

  //BY USER
  const collectedByUser = collectedItemsAll.filter(
    (product) => product.newOwnerId === visitedUserId
  );

  //FROM USER
  const givenByUser = collectedItemsUser.filter((product) => product.newOwnerId !== visitedUserId);

  //AVAILABLE: Gets all products which are not booked or organised
  const availableUserProductsRaw = userProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );

  const availableUserProducts = availableUserProductsRaw.sort(function (a, b) {
    return new Date(b.readyDate) - new Date(a.readyDate);
  });

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector((state) => state.projects.availableProjects).filter(
    (proj) => proj.ownerId === visitedUserId
  );

  //Sets indicator numbers
  const added = userProducts.length;
  const collected = collectedByUser.length;
  const collectedFromUser = collectedItemsUser.length;
  const nrOfProjects = userProjects.length;

  return (
    <ScrollViewToTop>
      <View style={userProfileStyles.centeredContent}>
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

        <Title style={userProfileStyles.title}>{currentProfile.profileName}</Title>
        {currentProfile.profileDescription ? (
          <Title style={userProfileStyles.subtitle}>{currentProfile.profileDescription}</Title>
        ) : null}

        <View style={userProfileStyles.row}>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {added ? added : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>Upplagda</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {collectedFromUser ? collectedFromUser : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>Sålda</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {collected ? collected : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>Köpta</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {nrOfProjects ? nrOfProjects : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>Projekt</Caption>
          </View>
        </View>
      </View>

      <View style={userProfileStyles.centeredContent}>
        <ContactDetails
          isProfile
          profileId={currentProfile.profileId}
          buttonText="kontaktdetaljer"
        />
      </View>

      {/* Product, project and proposal sections */}
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Projekt"
        subTitle="Projekt användaren bygger med återbruk"
        scrollData={userProjects}
        navigation={props.navigation}
      />
      <HorizontalScroll
        title="Tillgängligt förråd"
        subTitle="Återbruk av användaren som är tillgängligt att reservera"
        scrollData={availableUserProducts}
        navigation={props.navigation}
      />
      <HorizontalScroll
        textItem
        detailPath="ProposalDetail"
        title="Efterlysningar"
        subTitle="Återbruk, tjänster, tips..."
        scrollData={userProposals}
        navigation={props.navigation}
      />
      {givenByUser.length ? (
        <HorizontalScroll
          title="Gett Igen"
          subTitle="Återbruk användaren har gett till andra"
          scrollData={givenByUser}
          navigation={props.navigation}
        />
      ) : null}
    </ScrollViewToTop>
  );
};

export const userProfileStyles = StyleSheet.create({
  userInfoSection: {
    paddingTop: 10,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -6,
  },
  subtitle: {
    paddingHorizontal: 20,
    lineHeight: 14,
    paddingBottom: 14,
    fontWeight: 'normal',
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 3,
  },
});

export default UserProfile;
