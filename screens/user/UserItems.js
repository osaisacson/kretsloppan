import React from 'react';
import { useSelector } from 'react-redux';

import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Orders from '../../components/UI/Orders';

const UserItems = (props) => {
  const { userProjects, userProposals, userUploads, userProducts, navigation } = props;

  const activeUserProposals = userProposals.filter((proposal) => proposal.status !== 'löst');

  const userOrders = useSelector((state) => state.orders.userOrders);

  return (
    <>
      {userOrders.length ? (
        <>
          <HeaderTwo
            title="Mina pågående reservationer"
            indicator={userOrders.length}
            showNotificationBadge
          />
          <Orders isBuyer orders={userOrders} navigation={navigation} />
        </>
      ) : null}
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
