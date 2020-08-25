import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';

const SpotlightProductsScreen = (props) => {
  const allProductsRaw = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector((state) => state.proposals.availableProposals);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});

  const allProducts = allProductsRaw.filter((product) => !(product.amount === product.sold));

  const recentProductsSorted = allProducts.sort(function (a, b) {
    a = new Date(a.readyDate);
    b = new Date(b.readyDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProjectsSorted = allProjects.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentActiveProposals = allProposals.filter((proposal) => proposal.status !== 'löst');

  const recentProposalsSorted = recentActiveProposals.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  const recentProducts = recentProductsSorted.slice(0, 5);
  const recentProjects = recentProjectsSorted.slice(0, 5);
  const recentProposals = recentProposalsSorted.slice(0, 5);

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
        <HorizontalScroll
          title="Återbruk"
          subTitle="Senast tillgängliga återbruket"
          showAddLink={() => props.navigation.navigate('EditProduct')}
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
          scrollHeight={55}
          detailPath="ProposalDetail"
          title="Efterlysningar"
          subTitle="Kontakta efterlysaren om du sitter på svaret"
          showAddLink={() => props.navigation.navigate('EditProposal')}
          showMoreLink={
            allProposals.length > 1 ? () => props.navigation.navigate('Efterlysningar') : false
          }
          scrollData={recentProposals}
          navigation={props.navigation}
          icon={
            <MaterialCommunityIcons
              name="alert-decagram-outline"
              size={24}
              style={{
                marginRight: 3,
                marginBottom: 2,
              }}
            />
          }
        />
        <HorizontalScroll
          largeImageItem
          detailPath="ProjectDetail"
          title="Projekt"
          subTitle="Projekt som byggs med återbruk"
          showAddLink={() => props.navigation.navigate('EditProject')}
          showMoreLink={() => props.navigation.navigate('Projekt')}
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
      </ScrollView>
    </SaferArea>
  );
};

export default SpotlightProductsScreen;
