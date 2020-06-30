import React, { useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { createFilter } from 'react-native-search-filter';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import SearchBar from '../../components/UI/SearchBar';
import TextItem from '../../components/UI/TextItem';
import * as proposalsActions from '../../store/actions/proposals';

const ProposalsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get original proposals from state
  const proposals = useSelector((state) => state.proposals.availableProposals);

  //Prepare for changing the rendered proposals on search
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  //Load proposals
  const loadProposals = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('ProposalsScreen: fetching proposals...');
      dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  //Set which fields to filter by
  const KEYS_TO_FILTERS = ['title', 'description', 'price', 'status'];

  const filteredProposalsRaw = proposals.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

  const filteredProposals = filteredProposalsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProposalDetail', {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  if (error) {
    return <Error actionOnPress={loadProposals} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && proposals.length === 0) {
    return <EmptyState text="Hittade inga efterlysningar." />;
  }

  return (
    <View>
      <SearchBar
        placeholder="Leta bland efterlysningar: titel, beskrivning..."
        onChangeText={(term) => setSearchQuery(term.length ? term : '')}
      />

      <FlatList
        numColumns={1}
        initialNumToRender={10}
        onRefresh={loadProposals}
        refreshing={isRefreshing}
        data={filteredProposals}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <TextItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
            }}
          />
        )}
        ListHeaderComponent={
          <HeaderTwo
            isSearch
            showAddLink={() => props.navigation.navigate('EditProposal')}
            simpleCount={filteredProposals.length}
            indicator={filteredProposals.length ? filteredProposals.length : 0}
          />
        }
      />
    </View>
  );
};

export default ProposalsScreen;
