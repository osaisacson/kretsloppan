import React from 'react';
import { useSelector } from 'react-redux';

//Components
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import ContactDetails from '../../components/UI/ContactDetails';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ScrollViewToTop from '../../components/wrappers/ScrollViewToTop';

const UserProfile = (props) => {
  //Get profiles, return only the one which matches the id we pass in route params
  const visitedUserId = props.route.params.detailId;
  const profilesArray = useSelector(
    (state) => state.profiles.allProfiles
  ).filter((profile) => profile.profileId === visitedUserId);
  const currentProfile = profilesArray[0];

  //Gets all products for the user we are currently visiting
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  const userProducts = availableProducts.filter(
    (product) => product.ownerId === visitedUserId
  );

  //Gets all proposals for the user we are currently visiting
  const availableProposals = useSelector(
    (state) => state.proposals.availableProposals
  );

  const userProposalsRaw = availableProposals.filter(
    (proposal) => proposal.ownerId === visitedUserId
  );

  const userProposals = userProposalsRaw.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  //Reserved: Gets all collected products from user products
  const reservedUserProductsRaw = userProducts.filter(
    (product) => product.status === 'reserverad'
  );

  const reservedUserProducts = reservedUserProductsRaw.sort(function (a, b) {
    return new Date(b.reservedDate) - new Date(a.reservedDate);
  });

  //COLLECTED: Gets all collected products from all products
  const collectedItemsRawAll = availableProducts.filter(
    (product) => product.status === 'hämtad'
  );

  const collectedItemsAll = collectedItemsRawAll.sort(function (a, b) {
    return new Date(b.collectedDate) - new Date(a.collectedDate);
  });

  //COLLECTED: Gets all collected products from user products
  const collectedItemsRawUser = userProducts.filter(
    (product) => product.status === 'hämtad'
  );

  const collectedItemsUser = collectedItemsRawUser.sort(function (a, b) {
    return new Date(b.collectedDate) - new Date(a.collectedDate);
  });

  //BY USER
  const collectedByUser = collectedItemsAll.filter(
    (product) => product.newOwnerId === visitedUserId
  );

  //FROM USER
  const givenByUser = collectedItemsUser.filter(
    (product) => product.newOwnerId !== visitedUserId
  );

  //PAUSED: Gets all products which the user has put on hold
  const availableUserProductsRaw = userProducts.filter(
    (product) => product.status === 'redo' || product.status === 'bearbetas'
  );

  const availableUserProducts = availableUserProductsRaw.sort(function (a, b) {
    return new Date(b.readyDate) - new Date(a.readyDate);
  });

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector(
    (state) => state.projects.availableProjects
  ).filter((proj) => proj.ownerId === visitedUserId);

  //Sets indicator numbers
  const added = userProducts.length;
  const collected = collectedByUser.length;
  const nrOfProjects = userProjects.length;

  return (
    <ScrollViewToTop>
      <View style={styles.centeredContent}>
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

        <Title style={styles.title}>{currentProfile.profileName}</Title>
        {currentProfile.profileDescription ? (
          <Title style={styles.subtitle}>
            {currentProfile.profileDescription}}
          </Title>
        ) : null}

        <View style={styles.row}>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>
              {added ? added : 0}
            </Paragraph>
            <Caption style={styles.caption}>Upplagda</Caption>
          </View>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>
              {collected ? collected : 0}
            </Paragraph>
            <Caption style={styles.caption}>Hämtade</Caption>
          </View>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>
              {nrOfProjects ? nrOfProjects : 0}
            </Paragraph>
            <Caption style={styles.caption}>Projekt</Caption>
          </View>
        </View>
      </View>

      <View style={styles.centeredContent}>
        <ContactDetails
          isProfile={true}
          profileId={currentProfile.profileId}
          buttonText={'kontaktdetaljer'}
        />
      </View>

      {/* Product, project and proposal sections */}
      <HorizontalScroll
        title={'Tillgängligt förråd'}
        subTitle={'Återbruk upplagt av användaren'}
        scrollData={availableUserProducts}
        navigation={props.navigation}
      />
      {reservedUserProducts.length ? (
        <HorizontalScroll
          title={'Reserverat'}
          subTitle={'Återbruk upplagt av användaren, reserverat'}
          scrollData={reservedUserProducts}
          navigation={props.navigation}
        />
      ) : null}
      <HorizontalScroll
        textItem={true}
        detailPath="ProposalDetail"
        title={'Efterlysningar'}
        subTitle={'Återbruk, tjänster, tips...'}
        scrollData={userProposals}
        navigation={props.navigation}
      />
      <HorizontalScroll
        largeImageItem={true}
        detailPath={'ProjectDetail'}
        title={'Projekt'}
        subTitle={'Projekt användaren bygger med återbruk'}
        scrollData={userProjects}
        navigation={props.navigation}
      />
      {collectedByUser.length ? (
        <HorizontalScroll
          title={'Hämtat'}
          subTitle={'Återbruk använt av användaren'}
          scrollData={collectedByUser}
          navigation={props.navigation}
        />
      ) : null}
      {givenByUser.length ? (
        <HorizontalScroll
          title={'Gett Igen'}
          subTitle={'Återbruk användaren har gett till andra'}
          scrollData={givenByUser}
          navigation={props.navigation}
        />
      ) : null}
    </ScrollViewToTop>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: 'regular',
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
