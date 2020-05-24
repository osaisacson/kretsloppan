import React from 'react';
//Components
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
  const uploadedByUser = userProducts.sort(function (a, b) {
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
  const nrOfProjects = userProjects.length;

  //Navigate to the edit screen and forward the product id
  const editProfileHandler = () => {
    props.navigation.navigate('EditProfile', { detailId: currentProfile.id });
  };

  return (
    <ScrollViewToTop>
      <View style={userProfileStyles.userInfoSection}>
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
        <ButtonIcon color={Colors.neutral} icon="settings" onSelect={editProfileHandler} />

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
            <Caption>Hämtade</Caption>
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
            icon="plus"
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            mode="contained"
            onPress={() => props.navigation.navigate('EditProduct')}
            style={{ marginRight: 5 }}>
            Återbruk
          </Button>
          <Button
            icon="plus"
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            mode="contained"
            onPress={() => props.navigation.navigate('EditProject')}
            style={{ marginRight: 5 }}>
            Projekt
          </Button>
          <Button
            icon="plus"
            labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10 }}
            mode="contained"
            onPress={() => props.navigation.navigate('EditProposal')}>
            Efterlysning
          </Button>
        </View>
      </View>

      {/* Product, project and propsal sections */}
      {reservedProducts.length ? (
        <HorizontalScroll
          bgColor={Colors.lightPrimary}
          extraSubTitle="Nästa steg: kontakta intressenten/uppläggaren för att ordna logistik runt återbrukets upphämtning eller avlämning"
          navigation={props.navigation}
          scrollData={reservedProducts}
          showNotificationBadge
          subTitle="Väntar på att ni kontaktar varandra för organisering av upphämtning/avlämning. Notera: reservationer upphör gälla efter 24 timmar."
          title="Reservationer - att kontaktas"
        />
      ) : null}
      {toBeCollectedByUser.length ? (
        <HorizontalScroll
          bgColor={Colors.mediumPrimary}
          navigation={props.navigation}
          scrollData={toBeCollectedByUser}
          showNotificationBadge
          subTitle="Återbruk där ni kommit överens om logistik - väntar på att hämtas av dig."
          title="Överenskommet - att hämtas"
        />
      ) : null}
      {toBeCollectedFromUser.length ? (
        <HorizontalScroll
          bgColor={Colors.mediumPrimary}
          navigation={props.navigation}
          scrollData={toBeCollectedFromUser}
          showNotificationBadge
          subTitle="Återbruk där ni kommit överens om logistik - väntar på att lämnas till dig."
          title="Överenskommet - att lämnas"
        />
      ) : null}
      <HorizontalScroll
        buttonOnPress={() => props.navigation.navigate('Mitt upplagda återbruk')}
        buttonText=" Se allt"
        isNavigationButton
        navigation={props.navigation}
        scrollData={uploadedByUser}
        subTitle="Återbruk upplagt av mig"
        title="Upplagt av mig"
      />

      <HorizontalScroll
        detailPath="ProposalDetail"
        navigation={props.navigation}
        scrollData={userProposals}
        subTitle="Mina upplagda efterlysningar"
        textItem
        title="Efterlysningar"
      />
      <HorizontalScroll
        detailPath="ProjectDetail"
        largeImageItem
        navigation={props.navigation}
        scrollData={userProjects}
        subTitle="Projekt jag bygger med återbruk"
        title="Mina projekt"
      />
      {collectedByUser.length ? (
        <HorizontalScroll
          navigation={props.navigation}
          scrollData={collectedByUser}
          subTitle="Återbruk använt av mig"
          title="Hämtat"
        />
      ) : null}
      {givenByUser.length ? (
        <HorizontalScroll
          navigation={props.navigation}
          scrollData={givenByUser}
          subTitle="Återbruk jag gett till andra"
          title="Gett Igen"
        />
      ) : null}
    </ScrollViewToTop>
  );
};

export default UserSpotlightScreen;
