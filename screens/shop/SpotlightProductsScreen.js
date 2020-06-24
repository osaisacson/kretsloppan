import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import ActionLine from '../../components/UI/ActionLine';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';
import UserActions from '../user/UserActions';

const SpotlightProductsScreen = (props) => {
  const [showUserActions, setShowUserActions] = useState(false);

  const allProducts = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector((state) => state.proposals.availableProposals);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.id;

  //Filters all products with the tag 'redo'
  const recentProductsRaw = allProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );

  const recentProductsSorted = recentProductsRaw.sort(function (a, b) {
    a = new Date(a.readyDate);
    b = new Date(b.readyDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProjectsSorted = allProjects.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProposalsSorted = allProposals.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  const recentProducts = recentProductsSorted.slice(0, 5);
  const recentProjects = recentProjectsSorted.slice(0, 5);
  const recentProposals = recentProposalsSorted.slice(0, 5);

  //Gets all products by the logged in user
  const userProducts = useSelector((state) => state.products.userProducts);

  //RESERVED: Gets all products reserved by the user or from the user
  const reservedAllProductsRaw = allProducts.filter(
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
  const toBeSold = toBeSoldRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  //TO BE COLLECTED BY: Gets all products marked as ready to be collected by the user
  const toBeBoughtRaw = allProducts.filter(
    (product) => product.status === 'ordnad' && product.collectingUserId === loggedInUserId
  );
  const toBeBought = toBeBoughtRaw.sort(function (a, b) {
    a = new Date(a.collectingDate);
    b = new Date(b.collectingDate);
    return b > a ? -1 : b < a ? 1 : 0;
  });

  const badgeNr = reservedProducts.length + toBeBought.length + toBeSold.length;

  return (
    <SaferArea>
      {!currentProfile.hasReadNews ? (
        <Introduction
          currUserId={currentProfile.id}
          hasReadNews={currentProfile.hasReadNews}
          pic="https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1663&q=80"
          text="NYHETER: Kretsloppan släppt, hurra! För feedback kontakta asaisacson@gmail.com, vi gör kontinuerliga uppdateringar. Version: 1.0-beta3"
        />
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {badgeNr ? (
          <ActionLine
            isActive={showUserActions}
            badgeNr={badgeNr}
            onPress={() => {
              setShowUserActions(!showUserActions);
            }}
          />
        ) : null}
        {showUserActions ? (
          <UserActions
            reservedProducts={reservedProducts}
            toBeBought={toBeBought}
            toBeSold={toBeSold}
            navigation={props.navigation}
          />
        ) : null}
        <HorizontalScroll
          largeImageItem
          detailPath="ProjectDetail"
          title="Senaste Projekten"
          subTitle="Projekt som byggs med återbruk"
          showAddLink={() => props.navigation.navigate('EditProject')}
          showMoreLink={() => props.navigation.navigate('Projekt')}
          showMoreLinkName={`Se alla projekt (${allProjects.length})`}
          scrollData={recentProjects}
          navigation={props.navigation}
          icon={
            <Entypo
              name="tools"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
        <HorizontalScroll
          title="Senaste Återbruket"
          subTitle="Senast tillgängliga återbruket"
          showAddLink={() => props.navigation.navigate('EditProduct')}
          showMoreLink={() => props.navigation.navigate('Återbruk')}
          showMoreLinkName={`Se allt återbruk (${allProducts.length})`}
          scrollData={recentProducts}
          navigation={props.navigation}
          icon={
            <FontAwesome5
              name="recycle"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
        <HorizontalScroll
          textItem
          detailPath="ProposalDetail"
          title="Senaste efterlysningarna"
          subTitle="Kontakta efterlysaren om du sitter på svaret"
          showAddLink={() => props.navigation.navigate('EditProposal')}
          showMoreLink={() => props.navigation.navigate('Efterlysningar')}
          showMoreLinkName={`Se alla efterlysningar (${allProposals.length})`}
          scrollData={recentProposals}
          navigation={props.navigation}
          icon={
            <MaterialCommunityIcons
              name="alert-decagram-outline"
              size={24}
              style={{
                marginRight: 3,
              }}
            />
          }
        />
      </ScrollView>
    </SaferArea>
  );
};

export default SpotlightProductsScreen;
