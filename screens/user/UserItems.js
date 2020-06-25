import React from 'react';

import HorizontalScroll from '../../components/UI/HorizontalScroll';

const UserItems = (props) => {
  const { userProjects, userProposals, userUploads, userProducts, navigation } = props;

  const activeUserProposals = userProposals.filter((proposal) => proposal.status !== 'löst');

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
        scrollData={userUploads}
        simpleCount={userUploads.length}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProduct')}
        showMoreLink={() => props.navigation.navigate('Mitt upplagda återbruk')}
        showMoreLinkName={`Se hela mitt förråd (${userProducts.length})`}
      />
      <HorizontalScroll
        textItem
        scrollData={activeUserProposals}
        detailPath="ProposalDetail"
        title="Mina Aktiva Efterlysningar"
        simpleCount={activeUserProposals.length}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProposal')}
        showMoreLink={() => props.navigation.navigate('Alla mina efterlysningar')}
        showMoreLinkName={`Se alla mina efterlysningar(${userProposals.length})`}
      />
    </>
  );
};

export default UserItems;
