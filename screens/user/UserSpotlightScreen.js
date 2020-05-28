import React from 'react';
//Imports
import { View } from 'react-native';
import { Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

// import AddButton from '../../components/UI/AddButton';
import ButtonIcon from '../../components/UI/ButtonIcon';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Colors from '../../constants/Colors';
import { userProfileStyles } from '../details/UserProfile';
//Constants
import ScrollViewToTop from './../../components/wrappers/ScrollViewToTop';

const UserSpotlightScreen = (props) => {
  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector((state) => state.auth.userId);
  const profilesArray = useSelector((state) => state.profiles.allProfiles).filter(
    (profile) => profile.profileId === loggedInUserId
  );
  const currentProfile = profilesArray[0];

  //Gets all products
  const availableProducts = useSelector((state) => state.products.availableProducts);

  //Gets all products by the logged in user
  const userProducts = useSelector((state) => state.products.userProducts);

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
    (product) => product.newOwnerId === loggedInUserId
  );

  //FROM USER
  const givenByUser = collectedItemsUser.filter((product) => product.newOwnerId !== loggedInUserId);

  //RESERVED: Gets all products reserved by the user or from the user
  const reservedAllProductsRaw = availableProducts.filter(
    (product) => product.status === 'reserverad' && product.reservedUserId === loggedInUserId
  );

  const reservedByOthersRaw = userProducts.filter((product) => product.status === 'reserverad');

  const reservedProductsRaw = reservedAllProductsRaw.concat(reservedByOthersRaw);

  const reservedProducts = reservedProductsRaw.sort(function (a, b) {
    return new Date(b.reservedDate) - new Date(a.reservedDate);
  });

  //TO BE COLLECTED FROM: Gets all products from the user marked as ready to be collected
  const toBeCollectedFromUserRaw = userProducts.filter((product) => product.status === 'ordnad');

  const toBeCollectedFromUser = toBeCollectedFromUserRaw.sort(function (a, b) {
    return new Date(b.collectingDate) - new Date(a.collectingDate);
  });

  //TO BE COLLECTED BY: Gets all products marked as ready to be collected by the user
  const toBeCollectedByUserRaw = availableProducts.filter(
    (product) => product.status === 'ordnad' && product.collectingUserId === loggedInUserId
  );

  const toBeCollectedByUser = toBeCollectedByUserRaw.sort(function (a, b) {
    return new Date(b.collectingDate) - new Date(a.collectingDate);
  });

  //READY: Gets all products where the ownerId matches the id of our currently logged in user
  const uploadedByUserRaw = userProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );

  const uploadedByUser = uploadedByUserRaw.sort(function (a, b) {
    return new Date(b.readyDate) - new Date(a.readyDate);
  });

  //Get all projects, return only the ones which matches the logged in id
  const userProjects = useSelector((state) => state.projects.availableProjects).filter(
    (proj) => proj.ownerId === loggedInUserId
  );

  //Get user proposals
  const userProposalsRaw = useSelector((state) => state.proposals.userProposals);

  const userProposals = userProposalsRaw.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
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
      <View style={userProfileStyles.userInfoSection}>
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

        {/* <AddButton navigation={props.navigation} /> */}
        <Title style={userProfileStyles.title}>{currentProfile.profileName}</Title>
        {currentProfile.profileDescription ? (
          <Title style={userProfileStyles.subtitle}>{currentProfile.profileDescription}</Title>
        ) : null}
        <View style={userProfileStyles.row}>
          <View style={userProfileStyles.section}>
            <Paragraph style={userProfileStyles.paragraph}>{added ? added : 0}</Paragraph>
            <Caption>Upplagda</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={userProfileStyles.paragraph}>{collected ? collected : 0}</Paragraph>
            <Caption>Köpta</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={userProfileStyles.paragraph}>{sold ? sold : 0}</Paragraph>
            <Caption>Sålda</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={userProfileStyles.paragraph}>
              {nrOfProjects ? nrOfProjects : 0}
            </Paragraph>
            <Caption>Projekt</Caption>
          </View>
        </View>
        <View style={userProfileStyles.row}>
          <Button
            style={{ marginRight: 5 }}
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            icon="plus"
            mode="contained"
            onPress={() => props.navigation.navigate('EditProduct')}>
            Återbruk
          </Button>
          <Button
            style={{ marginRight: 5 }}
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            icon="plus"
            mode="contained"
            onPress={() => props.navigation.navigate('EditProject')}>
            Projekt
          </Button>
          <Button
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            icon="plus"
            mode="contained"
            onPress={() => props.navigation.navigate('EditProposal')}>
            Efterlysning
          </Button>
        </View>
      </View>

      {/* Product, project and propsal sections */}
      {reservedProducts.length ? (
        <HorizontalScroll
          title="Reservationer under diskussion"
          subTitle="Föreslå tid eller godkänn givet tidsförslag innan reservationen går ut. Om behov kontakta varandra för att diskutera fler detaljer."
          bgColor={Colors.lightPrimary}
          scrollData={reservedProducts}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
      {toBeCollectedByUser.length ? (
        <HorizontalScroll
          title="Överenskommet - att köpas"
          subTitle="Återbruk där ni kommit överens om logistik - väntar på att köpas och hämtas av dig på angiven tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeCollectedByUser}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
      {toBeCollectedFromUser.length ? (
        <HorizontalScroll
          title="Överenskommet - att säljas"
          subTitle="Återbruk där ni kommit överens om logistik - väntar på att säljas och lämnas av dig på angiven tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeCollectedFromUser}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
      <HorizontalScroll
        title="Mitt tillgängliga återbruk"
        subTitle="Återbruk upplagt av mig som är redo att reserveras"
        isNavigationButton
        buttonText=" Se allt"
        buttonOnPress={() => props.navigation.navigate('Mitt upplagda återbruk')}
        scrollData={uploadedByUser}
        navigation={props.navigation}
      />

      <HorizontalScroll
        textItem
        detailPath="ProposalDetail"
        title="Efterlysningar"
        subTitle="Mina upplagda efterlysningar"
        scrollData={userProposals}
        navigation={props.navigation}
      />
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Mina projekt"
        subTitle="Projekt jag bygger med återbruk"
        scrollData={userProjects}
        navigation={props.navigation}
      />
    </ScrollViewToTop>
  );
};

export default UserSpotlightScreen;
