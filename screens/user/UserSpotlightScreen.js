import React from 'react';
import { View, Image } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ButtonAdd from '../../components/UI/ButtonAdd';
import ButtonIcon from '../../components/UI/ButtonIcon';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Colors from '../../constants/Colors';
import { userProfileStyles } from '../details/UserProfile';
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
    return new Date(a.reservedDate) - new Date(b.reservedDate);
  });

  //TO BE COLLECTED FROM: Gets all products from the user marked as ready to be collected
  const toBeCollectedFromUserRaw = userProducts.filter((product) => product.status === 'ordnad');

  const toBeCollectedFromUser = toBeCollectedFromUserRaw.sort(function (a, b) {
    return new Date(a.collectingDate) - new Date(b.collectingDate);
  });

  //TO BE COLLECTED BY: Gets all products marked as ready to be collected by the user
  const toBeCollectedByUserRaw = availableProducts.filter(
    (product) => product.status === 'ordnad' && product.collectingUserId === loggedInUserId
  );

  const toBeCollectedByUser = toBeCollectedByUserRaw.sort(function (a, b) {
    return new Date(a.collectingDate) - new Date(b.collectingDate);
  });

  //READY: Gets all products where the ownerId matches the id of our currently logged in user
  const uploadedByUserRaw = userProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );

  const uploadedByUser = uploadedByUserRaw.sort(function (a, b) {
    return new Date(a.readyDate) - new Date(b.readyDate);
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

        {/* <AddButton navigation={props.navigation} /> */}
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
        <View style={userProfileStyles.row}>
          <ButtonAdd title="Återbruk" onPress={() => props.navigation.navigate('EditProduct')} />
          <ButtonAdd
            title="Projekt"
            style={{ marginHorizontal: 4, paddingRight: 5 }}
            onPress={() => props.navigation.navigate('EditProject')}
          />
          <ButtonAdd
            title="Efterlysning"
            onPress={() => props.navigation.navigate('EditProposal')}
          />
        </View>
      </View>
      {/* Product, project and proposal sections */}
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Mina projekt"
        subTitle="Projekt jag bygger med återbruk"
        scrollData={userProjects}
        navigation={props.navigation}
      />
      <HorizontalScroll
        title="Mitt tillgängliga återbruk"
        isNavigationButton
        buttonOnPress={() => props.navigation.navigate('Mitt upplagda återbruk')}
        scrollData={uploadedByUser}
        navigation={props.navigation}
      />
      <HorizontalScroll
        textItem
        detailPath="ProposalDetail"
        title="Mina Efterlysningar"
        subTitle="Mina upplagda efterlysningar"
        scrollData={userProposals}
        navigation={props.navigation}
      />
      {reservedProducts.length ? (
        <HorizontalScroll
          title="Reservationer"
          subTitle="Väntar på att ni kommer överens om tid för upphämtning/avlämning"
          bgColor={Colors.lightPrimary}
          scrollData={reservedProducts}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}

      {toBeCollectedByUser.length ? (
        <HorizontalScroll
          title="Överenskommet - att köpas"
          subTitle="Väntar på att köpas och hämtas av dig på överenskommen tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeCollectedByUser}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
      {toBeCollectedFromUser.length ? (
        <HorizontalScroll
          title="Överenskommet - att säljas"
          subTitle="Väntar på att säljas och lämnas av dig på överenskommen tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeCollectedFromUser}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
    </ScrollViewToTop>
  );
};

export default UserSpotlightScreen;
