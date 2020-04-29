import React from 'react';
import { useSelector } from 'react-redux';

//Components
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
// import AddButton from '../../components/UI/AddButton';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ScrollViewToTop from './../../components/wrappers/ScrollViewToTop';

//Constants
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

const UserSpotlightScreen = (props) => {
  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector((state) => state.auth.userId);
  const profilesArray = useSelector(
    (state) => state.profiles.allProfiles
  ).filter((profile) => profile.profileId === loggedInUserId);
  const currentProfile = profilesArray[0];

  //Gets all products
  const availableProducts = useSelector(
    (state) => state.products.availableProducts
  );

  //Gets all products by the logged in user
  const userProducts = useSelector((state) => state.products.userProducts);

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
    (product) => product.newOwnerId === loggedInUserId
  );

  //FROM USER
  const givenByUser = collectedItemsUser.filter(
    (product) => product.newOwnerId !== loggedInUserId
  );

  //RESERVED: Gets all products reserved by the user
  const reservedByUserRaw = useSelector(
    (state) => state.products.reservedProducts
  );

  const reservedByUser = reservedByUserRaw.sort(function (a, b) {
    return new Date(b.reservedDate) - new Date(a.reservedDate);
  });

  //PAUSED: Gets all products which the user has put on hold
  const pausedUserProductsRaw = userProducts.filter(
    (product) => product.status === 'bearbetas'
  );

  const pausedUserProducts = pausedUserProductsRaw.sort(function (a, b) {
    return new Date(b.pauseDate) - new Date(a.pauseDate);
  });

  //READY: Gets all ready products where the ownerId matches the id of our currently logged in user
  const readyUserProductsRaw = userProducts.filter(
    (product) => product.status === 'redo'
  );

  //TODO: make sorting below work
  const readyUserProducts = readyUserProductsRaw;
  // const readyUserProducts = readyUserProductsRaw.sort(function (a, b) {
  //     return new Date(b.readyDate) - new readyDate(a.date);
  //   return readyUserProductsRaw;
  // });

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector(
    (state) => state.projects.availableProjects
  ).filter((proj) => proj.ownerId === loggedInUserId);

  //Get user proposals
  const userProposals = useSelector((state) => state.proposals.userProposals);

  //Sets indicator numbers
  const added = userProducts.length;
  const collected = collectedByUser.length;
  const nrOfProjects = userProjects.length;

  //Navigate to the edit screen and forward the product id
  const editProfileHandler = () => {
    props.navigation.navigate('EditProfile', { detailId: currentProfile.id });
  };

  return (
    <ScrollViewToTop>
      <View style={styles.userInfoSection}>
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
        <ButtonIcon
          icon="settings"
          color={Colors.neutral}
          onSelect={editProfileHandler}
        />

        {/* <AddButton navigation={props.navigation} /> */}
        <Title style={styles.title}>{currentProfile.profileName}</Title>
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
        <View style={styles.row}>
          <Button
            style={{ marginRight: 5 }}
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            icon="plus"
            mode="contained"
            onPress={() => props.navigation.navigate('EditProduct')}
          >
            Återbruk
          </Button>
          <Button
            style={{ marginRight: 5 }}
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            icon="plus"
            mode="contained"
            onPress={() => props.navigation.navigate('EditProject')}
          >
            Projekt
          </Button>
          <Button
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            icon="plus"
            mode="contained"
            onPress={() => props.navigation.navigate('EditProposal')}
          >
            Efterlysning
          </Button>
        </View>
      </View>

      {/* Product, project and propsal sections */}
      <HorizontalScroll
        title={'Reserverat av mig'}
        subTitle={'Väntas på att hämtas upp av dig - se kort för detaljer'}
        extraSubTitle={'Notera att reservationen upphör gälla efter en vecka'}
        bgColor={Colors.lightPrimary}
        scrollData={reservedByUser}
        showNotificationBadge={true}
        navigation={props.navigation}
      />
      <HorizontalScroll
        title={'Upplagt av mig'}
        subTitle={'Återbruk upplagt av mig'}
        scrollData={readyUserProducts}
        navigation={props.navigation}
      />
      {pausedUserProducts.length ? (
        <HorizontalScroll
          title={'Pausat'}
          subTitle={
            'Återbruk jag lagt upp och pausat för bearbetning - glöm inte att markera som "redo" när klart'
          }
          scrollData={pausedUserProducts}
          navigation={props.navigation}
        />
      ) : null}
      <HorizontalScroll
        textItem={true}
        detailPath="ProposalDetail"
        title={'Efterlysta produkter'}
        subTitle={'Mina efterlysningar'}
        scrollData={userProposals}
        navigation={props.navigation}
      />
      <HorizontalScroll
        largeItem={true}
        detailPath={'ProjectDetail'}
        title={'Mina projekt'}
        subTitle={'Projekt jag bygger med återbruk'}
        scrollData={userProjects}
        navigation={props.navigation}
      />
      {collectedByUser.length ? (
        <HorizontalScroll
          title={'Hämtat'}
          subTitle={'Återbruk använt av mig'}
          scrollData={collectedByUser}
          navigation={props.navigation}
        />
      ) : null}
      {givenByUser.length ? (
        <HorizontalScroll
          title={'Gett Igen'}
          subTitle={'Återbruk jag gett till andra'}
          scrollData={givenByUser}
          navigation={props.navigation}
        />
      ) : null}
    </ScrollViewToTop>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -6,
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
    marginRight: Styles.leftRight,
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 3,
  },
});

export default UserSpotlightScreen;
