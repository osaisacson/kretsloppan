import React from 'react';
import { useSelector } from 'react-redux';

//Components
import { ScrollView } from 'react-native';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';
import HorizontalScroll from '../../components/UI/HorizontalScroll';

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

  //Filters all currently being worked on products
  const pausedProductsRaw = allProducts.filter(
    (product) => product.status === 'bearbetas'
  );

  const pausedProducts = pausedProductsRaw.sort(function (a, b) {
    return new Date(b.pauseDate) - new Date(a.pauseDate);
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
        text={'Här kan vi ha en introduktionstext med fina bilder.'}
      />
      <ScrollView nestedScrollEnabled={true}>
        {/* <HorizontalPicker pickerData={introductionData} /> */}
        <HorizontalScroll
          roundItem={true}
          detailPath="ProjectDetail"
          title={'Projekt'}
          subTitle={'Projekt som håller på att byggas med återbruk'}
          scrollData={allProjects}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'nya tillskott'}
          subTitle={'Det fräschaste, det nyaste'}
          scrollData={recentProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'under bearbetning'}
          subTitle={'Kommer snart, håller på att utvärderas eller repareras'}
          scrollData={pausedProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'nyligen reserverat'}
          subTitle={
            'Reserverade produkter, blir tillgängliga igen om om de inte hämtas inom en vecka.'
          }
          scrollData={bookedProducts}
          navigation={props.navigation}
        />
        <HorizontalScroll
          textItem={true}
          detailPath="ProposalDetail"
          title={'efterlysningar'}
          subTitle={'Material som önskas. Kontakta efterlysaren.'}
          scrollData={allProposals}
          navigation={props.navigation}
        />
      </ScrollView>
    </SaferArea>
  );
};

export default SpotlightProductsScreen;
