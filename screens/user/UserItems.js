import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Card from '../../components/UI/Card';
import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Orders from '../../components/UI/Orders';
import TouchableCmp from '../../components/UI/TouchableCmp';
import Colors from '../../constants/Colors';

const UserItems = ({ userProjects, userProposals, userProducts, loggedInUserId, navigation }) => {
  const [showArchive, setShowArchive] = useState(false);

  const activeUserProposals = userProposals.filter((proposal) => proposal.status !== 'löst');

  const userOrders = useSelector((state) => state.orders.userOrders);
  const allOrders = useSelector((state) => state.orders.availableOrders);

  const ordersToSell = userOrders.filter((order) => !order.isCollected);
  const ordersToBuy = allOrders.filter(
    (order) => order.sellerId === loggedInUserId && !order.isCollected
  );

  const soldOrders = allOrders.filter(
    (order) => order.isCollected && loggedInUserId === order.sellerId
  );
  const boughtOrders = userOrders.filter(
    (order) => order.buyerId === loggedInUserId && order.isCollected
  );

  const toggleShowArchive = () => {
    setShowArchive((prevState) => !prevState);
  };

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

      <HorizontalScroll
        title="Mitt återbruk"
        scrollData={userProducts}
        simpleCount={userProducts.length}
        navigation={navigation}
        showAddLink={() => navigation.navigate('EditProduct')}
        showMoreLink={userProducts.length ? () => navigation.navigate('Mitt återbruk') : false}
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

      <Card style={{ marginTop: 4 }}>
        <TouchableCmp onPress={toggleShowArchive}>
          <HeaderTwo title="Se arkiv" simpleCount={boughtOrders.length + soldOrders.length} />

          <AntDesign
            style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, marginTop: -20 }}
            name="caretdown"
            size={16}
            color="#666"
          />
        </TouchableCmp>
      </Card>
      {showArchive ? (
        <View style={{ backgroundColor: '#fff' }}>
          {boughtOrders.length ? (
            <>
              <HeaderTwo title="Köpt" simpleCount={boughtOrders.length} />
              <Orders
                loggedInUserId={loggedInUserId}
                orders={boughtOrders}
                navigation={navigation}
              />
              <Divider
                style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }}
              />
            </>
          ) : null}
          {soldOrders.length ? (
            <>
              <HeaderTwo title="Sålt" simpleCount={soldOrders.length} />
              <Orders loggedInUserId={loggedInUserId} orders={soldOrders} navigation={navigation} />
              <Divider
                style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }}
              />
            </>
          ) : null}
        </View>
      ) : null}
    </>
  );
};

export default UserItems;
