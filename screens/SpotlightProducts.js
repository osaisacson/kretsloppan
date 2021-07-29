import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetProducts from '../hooks/useGetProducts';

import { FlatList, View, StyleSheet } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import HeaderTwo from '../components/UI/HeaderTwo';
import ButtonSeeMore from '../components/UI/ButtonSeeMore';
import EmptyState from '../components/UI/EmptyState';
import ProductItem from '../components/UI/ProductItem';

const SpotlightProducts = ({
  nrItemsToShow,
  rowsToShow,
  title,
  showButtonAddNew,
  showButtonSeeMore,
  projectId,
}) => {
  const { isLoading, isError, data, error } = useGetProducts();

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
    console.log('Loading products in SpotlightProducts via the useGetProducts hook...');
    return <EmptyState text="Hämtar produkter" />;
  }

  console.log('Products found: ', data.length);

  //Only show products that belong to a specific project
  const products = projectId ? data.filter((product) => product.projectId === projectId) : data;

  const productsSorted = products.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const productsToShow = nrItemsToShow ? productsSorted.slice(0, nrItemsToShow) : productsSorted;

  return (
    <FlatList
      listKey="productsFlatlist"
      numColumns={rowsToShow}
      data={productsToShow}
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
            nrToShow={products.length > 1 ? products.length : null}
            onSelect={products.length > 1 ? () => navigation.navigate('Återbruk') : false}
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

export default SpotlightProducts;
