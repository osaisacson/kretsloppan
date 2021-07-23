import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetProducts from '../../hooks/useGetProducts';

import { FlatList, View, StyleSheet } from 'react-native';

import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import Error from '../../components/UI/Error';
import EmptyState from '../../components/UI/EmptyState';
import ProductItem from '../../components/UI/ProductItem';
import ButtonSeeMore from '../../components/UI/ButtonSeeMore';

const SpotlightProducts = () => {
  const { status, data, isFetching, error } = useGetProducts();

  const navigation = useNavigation();

  if (status === 'error') {
    console.log('ERROR: ', error.message);
    return <Error />;
  }

  if (status === 'loading') {
    console.log('Loading products in SpotlightProducts via the useGetProducts hook...');
    return <Loader />;
  }

  if (!(status === 'loading') && data.length === 0) {
    console.log('...no products found.');
    return <EmptyState text="Inga produkter hittade." />;
  }

  if (isFetching) {
    return <EmptyState text="Hämtar produkter" />;
  }

  const allProducts = data.filter((product) => !(product.amount === product.sold));

  const recentProductsSorted = allProducts.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProducts = recentProductsSorted.slice(0, 6);

  console.log('...done! Products found: ', data.length);

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
          indicator={allProducts.length ? allProducts.length : 0}
        />
      }
      ListFooterComponent={
        <ButtonSeeMore
          onSelect={allProducts.length > 1 ? () => navigation.navigate('Återbruk') : false}
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
