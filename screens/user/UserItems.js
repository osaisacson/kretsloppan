import React from 'react';

import HorizontalScroll from '../../components/UI/HorizontalScroll';

const UserItems = (props) => {
  const { userProjects, userProposals, userUploads, userProducts, navigation } = props;

  const activeUserProposals = userProposals.filter((proposal) => proposal.status !== 'löst');

  return (
    <>
      <HorizontalScroll
        textItem
        scrollData={activeUserProposals}
        detailPath="ProposalDetail"
        title="Mina Aktiva Efterlysningar"
        simpleCount={activeUserProposals.length}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProposal')}
        showMoreLink={
          userProposals.length > 1
            ? () => props.navigation.navigate('Alla mina efterlysningar')
            : false
        }
        showMoreLinkName={`Se alla mina efterlysningar(${userProposals.length})`}
      />
      <HorizontalScroll
        title="Mitt tillgängliga återbruk"
        scrollData={userUploads}
        simpleCount={userUploads.length}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProduct')}
        showMoreLink={
          userProducts.length ? () => props.navigation.navigate('Mitt upplagda återbruk') : false
        }
        showMoreLinkName={`Se hela mitt förråd (${userProducts.length})`}
      />
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Mina återbruksprojekt"
        scrollData={userProjects}
        simpleCount={userProjects.length}
        navigation={navigation}
        showAddLink={() => props.navigation.navigate('EditProject')}
      />
    </>
  );
};

export default UserItems;
