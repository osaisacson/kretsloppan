import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

//Imports
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';

const SpotlightProductsScreen = (props) => {
  //Get products, projects and proposals from state
  const allProducts = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector((state) => state.proposals.availableProposals);

  //Filters all products with the tag 'redo'
  const recentProductsRaw = allProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );

  const recentProductsSorted = recentProductsRaw.sort(function (a, b) {
    a = new Date(a.readyDate);
    b = new Date(b.readyDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProducts = recentProductsSorted.slice(0, 5);

  return (
    <SaferArea>
      <Introduction
        pic="https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1663&q=80"
        text="Mer återbruk åt folket! Här nere kan du se tillgängligt material, aktuella efterlysningar och projekt som håller på att byggas med återbruk. Lägg upp och hantera återbruk via din profilsida. Version: 1.0-beta2"
      />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <HorizontalScroll
          roundItem
          detailPath="ProjectDetail"
          title="Projekt"
          subTitle="Projekt som håller på att byggas med återbruk"
          isNavigationButton
          buttonText="Se alla"
          buttonOnPress={() => props.navigation.navigate('Projekt')}
          scrollData={allProjects}
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
          isNavigationButton
          buttonText="Se alla"
          buttonOnPress={() => props.navigation.navigate('Återbruk')}
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
          title="efterlysningar"
          subTitle="Kreti och pleti. Kontakta efterlysaren om du sitter på svaret."
          isNavigationButton
          buttonText="Se alla"
          buttonOnPress={() => props.navigation.navigate('Efterlysningar')}
          scrollData={allProposals}
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
