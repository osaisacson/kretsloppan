import React from 'react';
//Components
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

  //Reserved: Gets all collected products from user products
  const reservedUserProductsRaw = userProducts.filter((product) => product.status === 'reserverad');

  const reservedUserProducts = reservedUserProductsRaw.sort(function (a, b) {
    return new Date(b.reservedDate) - new Date(a.reservedDate);
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
  const availableUserProductsRaw = userProducts.filter((product) => product.status === 'redo');

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
  const nrOfProjects = userProjects.length;

  return (
    <ScrollViewToTop>
      <View style={userProfileStyles.centeredContent}>
        <Avatar.Image
          size={80}
          source={
            currentProfile && currentProfile.image
              ? { uri: currentProfile.image }
              : require('./../../assets/avatar-placeholder-image.png')
          }
          style={{
            color: '#fff',
            backgroundColor: '#fff',
            borderWidth: 0.3,
            borderColor: '#000',
          }}
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
              {collected ? collected : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>Hämtade</Caption>
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
          buttonText="kontaktdetaljer"
          isProfile
          profileId={currentProfile.profileId}
        />
      </View>

      {/* Product, project and proposal sections */}
      <HorizontalScroll
        navigation={props.navigation}
        scrollData={availableUserProducts}
        subTitle="Återbruk upplagt av användaren"
        title="Tillgängligt förråd"
      />
      {reservedUserProducts.length ? (
        <HorizontalScroll
          navigation={props.navigation}
          scrollData={reservedUserProducts}
          subTitle="Återbruk upplagt av användaren, reserverat"
          title="Reserverat"
        />
      ) : null}
      <HorizontalScroll
        detailPath="ProposalDetail"
        navigation={props.navigation}
        scrollData={userProposals}
        subTitle="Återbruk, tjänster, tips..."
        textItem
        title="Efterlysningar"
      />
      <HorizontalScroll
        detailPath="ProjectDetail"
        largeImageItem
        navigation={props.navigation}
        scrollData={userProjects}
        subTitle="Projekt användaren bygger med återbruk"
        title="Projekt"
      />
      {collectedByUser.length ? (
        <HorizontalScroll
          navigation={props.navigation}
          scrollData={collectedByUser}
          subTitle="Återbruk använt av användaren"
          title="Hämtat"
        />
      ) : null}
      {givenByUser.length ? (
        <HorizontalScroll
          navigation={props.navigation}
          scrollData={givenByUser}
          subTitle="Återbruk användaren har gett till andra"
          title="Gett Igen"
        />
      ) : null}
    </ScrollViewToTop>
  );
};

export const userProfileStyles = StyleSheet.create({
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
    textAlign: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 0,
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 14,
    paddingBottom: 14,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginTop: -6,
    textAlign: 'center',
  },
});

export default UserProfile;
