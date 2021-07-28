import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetProducts from '../../hooks/useGetProducts';

import { FlatList, View, StyleSheet } from 'react-native';

import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import ProductItem from '../../components/UI/ProductItem';
import ButtonSeeMore from '../../components/UI/ButtonSeeMore';

const SpotlightProducts = () => {
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

  const recentProductsSorted = data.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProducts = recentProductsSorted.slice(0, 9);

  return (
    <FlatList
      listKey="productsFlatlist"
      numColumns={3}
      data={recentProducts}
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
          title={'Återbruk'}
          showAddLink={() => navigation.navigate('EditProduct')}
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
        <ButtonSeeMore
          nrToShow={data.length > 1 ? data.length : null}
          onSelect={data.length > 1 ? () => navigation.navigate('Återbruk') : false}
        />
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
