import React from 'react';
import { useSelector } from 'react-redux';

//Components
import { ScrollView } from 'react-native';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

const SpotlightProductsScreen = (props) => {
  //Get products, projects and proposals from state
  const allProducts = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector(
    (state) => state.proposals.availableProposals
  );

  //Filters all products with the tag 'redo'
  const recentProductsRaw = allProducts.filter(
    (product) => product.status === 'redo'
  );

  const recentProducts = recentProductsRaw.sort(function (a, b) {
    return new Date(b.readyDate) - new Date(a.readyDate);
  });

  //Filters all booked products
  const bookedProductsRaw = allProducts.filter(
    (product) => product.status === 'reserverad'
  );

  const bookedProducts = bookedProductsRaw.sort(function (a, b) {
    return new Date(b.reservedDate) - new Date(a.reservedDate);
  });

  return (
    <SaferArea>
      <Introduction
        pic={
          'https://images.unsplash.com/photo-1489533119213-66a5cd877091?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80'
        }
        text={
          'Välkommen! Se en översikt av nya projekt, återbruk och efterlysningar nedan. Lägg upp eget material genom att gå till din profil. Notera att denna version av appen är en betaversion som fortfarande håller på att testas.'
        }
      />
      <ScrollView nestedScrollEnabled={true}>
        <HorizontalScroll
          roundItem={true}
          detailPath="ProjectDetail"
          title={'Projekt'}
          subTitle={'Projekt som håller på att byggas med återbruk'}
          isNavigationButton={true}
          buttonText={'Se alla'}
          buttonOnPress={() => props.navigation.navigate('Projekt')}
          scrollData={allProjects}
          navigation={props.navigation}
          icon={
            <Entypo
              name={'tools'}
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
        <HorizontalScroll
          title={'nya tillskott'}
          subTitle={'Senast uppladdade återbruket'}
          isNavigationButton={true}
          buttonText={'Se alla'}
          buttonOnPress={() => props.navigation.navigate('Återbruk')}
          scrollData={recentProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'Reservationer som snart går ut'}
          subTitle={
            'Reserverat återbruk blir tillgängligt igen om logistik med upphämtning inte hanteras inom 24 timmar. Här är det återbruk som snart blir ledigt.'
          }
          isNavigationButton={true}
          buttonText={'Se alla'}
          buttonOnPress={() => props.navigation.navigate('Återbruk')}
          scrollData={bookedProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          textItem={true}
          detailPath="ProposalDetail"
          title={'efterlysningar'}
          subTitle={
            'Kreti och pleti. Kontakta efterlysaren om du sitter på svaret.'
          }
          isNavigationButton={true}
          buttonText={'Se alla'}
          buttonOnPress={() => props.navigation.navigate('Efterlysningar')}
          scrollData={allProposals}
          navigation={props.navigation}
          icon={
            <MaterialCommunityIcons
              name={'alert-decagram-outline'}
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
