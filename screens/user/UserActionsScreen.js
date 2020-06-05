import React from 'react';
import { View, Image } from 'react-native';
import { Avatar, Title, Caption, Paragraph } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ButtonAdd from '../../components/UI/ButtonAdd';
import ButtonIcon from '../../components/UI/ButtonIcon';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ScrollViewToTop from '../../components/wrappers/ScrollViewToTop';
import Colors from '../../constants/Colors';
import { userProfileStyles } from '../details/UserProfile';

const UserActionsScreen = (props) => {
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

  //RESERVED: Gets all products reserved by the user or from the user
  const reservedAllProductsRaw = availableProducts.filter(
    (product) => product.status === 'reserverad' && product.reservedUserId === loggedInUserId
  );
  const reservedByOthersRaw = userProducts.filter((product) => product.status === 'reserverad');
  const reservedProductsRaw = reservedAllProductsRaw.concat(reservedByOthersRaw);
  const reservedProducts = reservedProductsRaw.sort(function (a, b) {
    a = new Date(a.reservedDate);
    b = new Date(b.reservedDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //TO BE COLLECTED FROM: Gets all products from the user marked as ready to be collected
  const toBeSoldRaw = userProducts.filter((product) => product.status === 'ordnad');
  const toBeSoldByUser = toBeSoldRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //TO BE COLLECTED BY: Gets all products marked as ready to be collected by the user
  const toBeBoughtRaw = availableProducts.filter(
    (product) => product.status === 'ordnad' && product.collectingUserId === loggedInUserId
  );
  const toBeBoughtByUser = toBeBoughtRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //Sets indicator numbers
  const reserved = reservedProducts.length;
  const toBeBought = toBeBoughtByUser.length;
  const toBeSold = toBeSoldByUser.length;

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
              {reserved ? reserved : 0}
            </Paragraph>
            <Caption style={{ color: '#fff' }}>Reserverade</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={{ color: '#fff', ...userProfileStyles.paragraph }}>
              {toBeBought ? toBeBought : 0}
            </Paragraph>
            <Caption style={{ color: '#fff' }}>Att köpas</Caption>
          </View>
          <View style={userProfileStyles.section}>
            <Paragraph style={{ color: '#fff', ...userProfileStyles.paragraph }}>
              {toBeSold ? toBeSold : 0}
            </Paragraph>
            <Caption style={{ color: '#fff' }}>Att säljas</Caption>
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

      {toBeBought ? (
        <HorizontalScroll
          title="Överenskommet - att köpas"
          subTitle="Väntar på att köpas och hämtas av dig på överenskommen tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeBoughtByUser}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
      {toBeSold ? (
        <HorizontalScroll
          title="Överenskommet - att säljas"
          subTitle="Väntar på att säljas och lämnas av dig på överenskommen tid."
          bgColor={Colors.mediumPrimary}
          scrollData={toBeSoldByUser}
          showNotificationBadge
          navigation={props.navigation}
        />
      ) : null}
    </ScrollViewToTop>
  );
};

export default UserActionsScreen;
