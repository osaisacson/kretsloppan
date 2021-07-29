import React, { useState } from 'react';
import useGetProposals from '../hooks/useGetProposals';
import { FlatList, StyleSheet, View } from 'react-native';

import { createFilter } from 'react-native-search-filter';
import SaferArea from '../components/wrappers/SaferArea';
import Loader from '../components/UI/Loader';
import HeaderTwo from '../components/UI/HeaderTwo';
import SearchBar from '../components/UI/SearchBar';
import ProposalItem from '../components/UI/ProposalItem';

const ProposalsList = ({ navigation }) => {
  const { isLoading, isError, data, error } = useGetProposals();

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading proposals...`);
    return <Loader />;
  }

  const [searchQuery, setSearchQuery] = useState('');

  //Set which fields to filter by
  const KEYS_TO_FILTERS = ['title', 'description', 'price', 'status'];

  const filteredProposalsRaw = data.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

  const filteredProposals = filteredProposalsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const selectItemHandler = (itemData) => {
    props.navigation.navigate('ProposalDetail', {
      itemData: itemData,
    });
  };

  return (
    <SaferArea>
      <SearchBar
        placeholder="Leta bland projekt: titel, plats..."
        onChangeText={(term) => setSearchQuery(term)}
      />
      <FlatList
        numColumns={1}
        initialNumToRender={6}
        refreshing={isLoading}
        data={filteredProposals}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <>
            <View style={styles.container}>
              <ProposalItem
                navigation={navigation}
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
            isSearch
            simpleCount={filteredProposals.length}
            showAddLink={() => navigation.navigate('EditProposal')}
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
  },
});

export default ProposalsList;
