import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ContactDetails from '../../components/UI/ContactDetails';
import EmptyState from '../../components/UI/EmptyState';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ScrollViewToTop from '../../components/wrappers/ScrollViewToTop';

const UserProfile = (props) => {
  //Get profiles, return only the one which matches the id we pass in route params
  const visitedUserId = props.route.params.detailId;
  const profilesArray = useSelector((state) => state.profiles.allProfiles).filter(
    (profile) => profile.profileId === visitedUserId
  );
  const currentProfile = profilesArray[0];

  //Gets all products which are not booked or organised for the user we are currently visiting
  const allProducts = useSelector((state) => state.products.availableProducts);
  const userProducts = allProducts.filter((product) => product.ownerId === visitedUserId);
  const availableUserProducts = userProducts.filter(
    (product) => product.amount > 0 && !(product.amount === product.sold)
  );
  const soldUserProducts = userProducts.filter((product) => product.amount === product.sold);
  const reservedUserProducts = userProducts.filter((product) => product.amount === 0);

  const availableUserProductsSorted = availableUserProducts.sort(function (a, b) {
    a = new Date(a.readyDate);
    b = new Date(b.readyDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //Gets all orders by the logged in user
  const userOrders = useSelector((state) => state.orders.availableOrders).filter(
    (order) => order.buyerId === visitedUserId
  );
  const collectedUserOrders = userOrders.filter((order) => order.isCollected);

  //Gets all proposals for the user we are currently visiting
  const availableProposals = useSelector((state) => state.proposals.availableProposals);
  const userProposalsRaw = availableProposals.filter(
    (proposal) => proposal.ownerId === visitedUserId && proposal.status !== 'löst'
  );
  const userProposals = userProposalsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector((state) => state.projects.availableProjects).filter(
    (proj) => proj.ownerId === visitedUserId
  );

  const userHasNoContent = !userProducts && !userOrders && !userProposals && !userProjects;

  //Sets indicator numbers
  const added = userProducts.length;
  const collected = collectedUserOrders.length;
  const nrOfProjects = userProjects.length;

  return (
    <ScrollViewToTop>
      <View style={userProfileStyles.centeredContent}>
        <Avatar.Image
          style={{
            marginTop: 20,
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
        {currentProfile.location ? (
          <Title
            style={{
              fontFamily: 'roboto-bold-italic',
              ...userProfileStyles.subtitle,
            }}>
            {currentProfile.location}
          </Title>
        ) : null}
        {currentProfile.profileDescription ? (
          <Title style={userProfileStyles.subtitle}>{currentProfile.profileDescription}</Title>
        ) : null}

        <View style={userProfileStyles.row}>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {added ? added : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>
              {added === 1 ? 'Upplagd' : 'Upplagda'}
            </Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {collected ? collected : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>
              {collected === 1 ? 'Köpt' : 'Köpta'}
            </Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={[userProfileStyles.paragraph, userProfileStyles.caption]}>
              {nrOfProjects ? nrOfProjects : 0}
            </Paragraph>
            <Caption style={userProfileStyles.caption}>Projekt</Caption>
          </View>
        </View>
      </View>

      <View style={{ ...userProfileStyles.centeredContent, marginBottom: 20 }}>
        <ContactDetails
          isProfile
          profileId={currentProfile.profileId}
          buttonText="kontaktdetaljer"
        />
      </View>

      {userHasNoContent ? <EmptyState>Användaren har inte lagt upp något ännu</EmptyState> : null}

      {availableUserProductsSorted.length ? (
        <HorizontalScroll
          title="Till Salu"
          simpleCount={availableUserProductsSorted.length}
          scrollData={availableUserProductsSorted}
          navigation={props.navigation}
        />
      ) : null}
      {reservedUserProducts.length ? (
        <HorizontalScroll
          title="För närvarande reserverat"
          simpleCount={reservedUserProducts.length}
          scrollData={reservedUserProducts}
          navigation={props.navigation}
        />
      ) : null}
      {soldUserProducts.length ? (
        <HorizontalScroll
          title="Sålt"
          simpleCount={soldUserProducts.length}
          scrollData={soldUserProducts}
          navigation={props.navigation}
        />
      ) : null}
      {userProposals.length ? (
        <HorizontalScroll
          textItem
          detailPath="ProposalDetail"
          title="Efterlysningar"
          simpleCount={userProposals.length}
          scrollData={userProposals}
          navigation={props.navigation}
        />
      ) : null}
      {userProjects.length ? (
        <HorizontalScroll
          largeImageItem
          detailPath="ProjectDetail"
          title="Återbruksprojekt"
          simpleCount={userProjects.length}
          scrollData={userProjects}
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
