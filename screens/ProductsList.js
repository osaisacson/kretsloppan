import React, { useState } from 'react';
import useGetProducts from '../hooks/useGetProducts';
import { FlatList, StyleSheet, View } from 'react-native';

import { createFilter } from 'react-native-search-filter';
import SaferArea from '../components/wrappers/SaferArea';
import Error from '../components/UI/Error';
import Loader from '../components/UI/Loader';
import EmptyState from '../components/UI/EmptyState';
import HeaderTwo from '../components/UI/HeaderTwo';
import SearchBar from '../components/UI/SearchBar';
import ProductItem from '../components/UI/ProductItem';
import { Divider } from 'react-native-paper';
import ProductAvatarAndLocation from '../components/UI/ProductAvatarAndLocation';
import Styles from '../constants/Styles';

const ProductsList = ({ navigation }) => {
  const { isLoading, isError, data, error } = useGetProducts();

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading products...`);
    return <Loader />;
  }

  const [searchQuery, setSearchQuery] = useState('');

  const selectItemHandler = (itemData) => {
    navigation.navigate('ProductDetail', { itemData: itemData });
  };

  const KEYS_TO_SEARCH_BY = [
    'address',
    'location',
    'category',
    'condition',
    'style',
    'material',
    'color',
    'title',
    'amount',
    'description',
    'background',
    'length',
    'height',
    'width',
    'price',
    'priceText',
    'status',
    'internalComments',
  ];

  const filteredProductsRaw = data.filter(createFilter(searchQuery, KEYS_TO_SEARCH_BY));

  const filteredProducts = filteredProductsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  return (
    <SaferArea>
      <SearchBar
        placeholder="Leta bland återbruk: titel, skick, mått..."
        onChangeText={(term) => setSearchQuery(term)}
      />
      <FlatList
        numColumns={1}
        initialNumToRender={12}
        refreshing={isLoading}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <>
            <Divider
              style={{
                marginBottom: 10,
              }}
            />
            <View style={styles.container}>
              <ProductAvatarAndLocation navigation={navigation} itemData={itemData.item} />
              <ProductItem
                cardHeight={Styles.largeProductItemHeight}
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
            isSearch
            simpleCount={filteredProducts.length}
            showAddLink={() => navigation.navigate('EditProduct')}
          />
        }
      />
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
    marginBottom: 80,
  },
});

export default ProductsList;
