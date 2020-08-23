import React from 'react';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Orders from '../../components/UI/Orders';
import Colors from '../../constants/Colors';

const UserItems = ({ userProjects, userProposals, userProducts, loggedInUserId, navigation }) => {
  const activeUserProposals = userProposals.filter((proposal) => proposal.status !== 'löst');

  const ordersByUser = useSelector((state) => state.orders.userOrders);
  const ordersFromUser = useSelector((state) => state.orders.availableOrders).filter(
    (order) => order.ownerId === loggedInUserId
  );

  return (
    <>
      {ordersByUser.length ? (
        <>
          <HeaderTwo
            title="Mina pågående reservationer"
            indicator={ordersByUser.length}
            showNotificationBadge
          />
          <Orders isBuyer orders={ordersByUser} navigation={navigation} />
          <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
        </>
      ) : null}
      {ordersFromUser.length ? (
        <>
          <HeaderTwo
            title="Mina pågående beställningar"
            indicator={ordersFromUser.length}
            showNotificationBadge
          />
          <Orders isBuyer orders={ordersFromUser} navigation={navigation} />
          <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
        </>
      ) : null}
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
