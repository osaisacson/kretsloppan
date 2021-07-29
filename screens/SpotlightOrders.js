import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetOrders from '../hooks/useGetOrders';

import { FlatList, View, StyleSheet } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import HeaderTwo from '../components/UI/HeaderTwo';
import ButtonSeeMore from '../components/UI/ButtonSeeMore';
import EmptyState from '../components/UI/EmptyState';
import ProductItem from '../components/UI/ProductItem';

const SpotlightOrders = ({
  nrItemsToShow,
  rowsToShow,
  title,
  showButtonAddNew,
  showButtonSeeMore,
  projectId,
}) => {
  const { isLoading, isError, data, error } = useGetOrders();

  const navigation = useNavigation();

  const selectItemHandler = (itemData) => {
    navigation.navigate('ProductDetail', {
      itemData: itemData,
    });
  };

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log('Loading orders in SpotlightOrders via the useGetOrders hook...');
    return <EmptyState text="Hämtar produkter" />;
  }

  console.log('Orders found: ', data.length);

  //Only show orders that belong to a specific project
  const orders = projectId ? data.filter((order) => order.projectId === projectId) : data;

  if (projectId && !orders.length) {
    console.log('Could not find any orders.');
    return <EmptyState text="Inget återbruk i projektet ännu" />;
  }

  const ordersSorted = orders.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const ordersToShow = nrItemsToShow ? ordersSorted.slice(0, nrItemsToShow) : ordersSorted;

  return (
    <FlatList
      listKey="ordersFlatlist"
      numColumns={rowsToShow}
      data={ordersToShow}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <>
          <View style={styles.container}>
            <ProductItem
              hideInfo
              cardHeight={150}
              itemData={itemData.item}
              onSelect={() => {
                selectItemHandler(itemData.item);
              }}
            />
          </View>
        </>
      )}
      ListHeaderComponent={
        <HeaderTwo
          title={title}
          showAddLink={showButtonAddNew ? () => navigation.navigate('EditProduct') : null}
          icon={
            <FontAwesome5
              name="recycle"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
      }
      ListFooterComponent={
        showButtonSeeMore ? (
          <ButtonSeeMore
            nrToShow={orders.length > 1 ? orders.length : null}
            onSelect={orders.length > 1 ? () => navigation.navigate('Återbruk') : false}
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
  },
});

export default SpotlightOrders;
