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
  const recentProducts = allProducts.filter(
    (product) => product.status === 'redo'
  );

  //Filters all currently being worked on products
  const inProgressProducts = allProducts.filter(
    (product) => product.status === 'bearbetas'
  );

  //Filters all booked products
  const bookedProducts = allProducts.filter(
    (product) => product.status === 'reserverad'
  );

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
          scrollData={inProgressProducts}
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
