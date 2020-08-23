import React from 'react';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Orders from '../../components/UI/Orders';
import Colors from '../../constants/Colors';

const UserItems = ({ userProjects, userProposals, userProducts, navigation }) => {
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
      <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
      <HorizontalScroll
        textItem
        scrollData={activeUserProposals}
        detailPath="ProposalDetail"
        title="Mina Aktiva Efterlysningar"
        simpleCount={activeUserProposals.length}
        navigation={navigation}
        showAddLink={() => navigation.navigate('EditProposal')}
        showMoreLink={
          userProposals.length > 1 ? () => navigation.navigate('Alla mina efterlysningar') : false
        }
        showMoreNr={userProposals.length}
      />
      <HorizontalScroll
        title="Mitt upplagda återbruk"
        scrollData={userProducts}
        simpleCount={userProducts.length}
        navigation={navigation}
        showAddLink={() => navigation.navigate('EditProduct')}
        showMoreLink={
          userProducts.length ? () => navigation.navigate('Mitt upplagda återbruk') : false
        }
        showMoreNr={userProducts.length}
      />
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Mina återbruksprojekt"
        scrollData={userProjects}
        simpleCount={userProjects.length}
        navigation={navigation}
        showAddLink={() => navigation.navigate('EditProject')}
      />
    </>
  );
};

export default UserItems;
