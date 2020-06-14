import React from 'react';

import HorizontalScroll from '../../components/UI/HorizontalScroll';

const UserItems = (props) => {
  const { userProjects, userProposals, userUploads, navigation } = props;

  return (
    <>
      {/* Product, project and proposal sections */}
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Mina projekt"
        subTitle="Projekt jag bygger med återbruk"
        scrollData={userProjects}
        simpleCount={userProjects.length}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProject')}
      />
      <HorizontalScroll
        title="Mitt tillgängliga återbruk"
        isNavigationButton
        buttonOnPress={() => navigation.navigate('Mitt upplagda återbruk')}
        simpleCount={userUploads.length}
        scrollData={userUploads}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProduct')}
        showMoreLink={() => props.navigation.navigate('Mitt upplagda återbruk')}
      />
      <HorizontalScroll
        textItem
        detailPath="ProposalDetail"
        title="Mina Efterlysningar"
        subTitle="Mina upplagda efterlysningar"
        simpleCount={userProposals.length}
        scrollData={userProposals}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProposal')}
      />
    </>
  );
};

export default UserItems;
