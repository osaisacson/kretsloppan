import React from 'react';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Orders from '../../components/UI/Orders';
import Colors from '../../constants/Colors';

const UserItems = ({ userProjects, userProposals, userProducts, loggedInUserId, navigation }) => {
  const activeUserProposals = userProposals.filter((proposal) => proposal.status !== 'löst');

  const availableUserProducts = userProducts.filter(
    (product) => !(product.amount === product.sold)
  );

  const userOrders = useSelector((state) => state.orders.userOrders);
  const allOrders = useSelector((state) => state.orders.availableOrders);

  const ordersToSell = userOrders.filter((order) => !order.isCollected);
  const ordersToBuy = allOrders.filter(
    (order) => order.sellerId === loggedInUserId && !order.isCollected
  );

  const soldOrders = allOrders.filter((order) => order.isCollected);
  const boughtOrders = userOrders.filter(
    (order) => order.sellerId === loggedInUserId && order.isCollected
  );

  return (
    <>
      {ordersToSell.length ? (
        <>
          <HeaderTwo title="Att köpa" indicator={ordersToSell.length} showNotificationBadge />
          <Orders loggedInUserId={loggedInUserId} orders={ordersToSell} navigation={navigation} />
          <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
        </>
      ) : null}
      {ordersToBuy.length ? (
        <>
          <HeaderTwo title="Att sälja" indicator={ordersToBuy.length} showNotificationBadge />
          <Orders loggedInUserId={loggedInUserId} orders={ordersToBuy} navigation={navigation} />
          <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
        </>
      ) : null}
      {boughtOrders.length ? (
        <>
          <HeaderTwo title="Köpt" />
          <Orders loggedInUserId={loggedInUserId} orders={boughtOrders} navigation={navigation} />
          <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
        </>
      ) : null}
      {soldOrders.length ? (
        <>
          <HeaderTwo title="Sålt" />
          <Orders loggedInUserId={loggedInUserId} orders={soldOrders} navigation={navigation} />
          <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
        </>
      ) : null}
      <HorizontalScroll
        title="Mitt återbruk"
        scrollData={availableUserProducts}
        simpleCount={availableUserProducts.length}
        navigation={navigation}
        showAddLink={() => navigation.navigate('EditProduct')}
        showMoreLink={
          availableUserProducts.length ? () => navigation.navigate('Mitt återbruk') : false
        }
      />
      <HorizontalScroll
        textItem
        scrollData={activeUserProposals}
        detailPath="ProposalDetail"
        title="Mina Efterlysningar"
        simpleCount={activeUserProposals.length}
        navigation={navigation}
        showAddLink={() => navigation.navigate('EditProposal')}
        showMoreLink={
          userProposals.length > 1 ? () => navigation.navigate('Alla mina efterlysningar') : false
        }
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
