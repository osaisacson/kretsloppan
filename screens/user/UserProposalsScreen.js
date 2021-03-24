import React, { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import SearchBar from '../../components/UI/SearchBar';
import ProposalItem from '../../components/UI/ProposalItem';
import SaferArea from '../../components/wrappers/SaferArea';
import * as proposalsActions from '../../store/actions/proposals';

const UserProposalsScreen = (props) => {
  //Get user proposals from state
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;
  const availableProposals = useSelector((state) => state.proposals.availableProposals);
  const userProposals = availableProposals.filter(
    (proposal) => proposal.ownerId === loggedInUserId
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Prepare for changing the rendered proposals on search
  const [renderedProposals, setRenderedProposals] = useState(userProposals);
  const [searchQuery, setSearchQuery] = useState('');

  //Sort proposals by date
  const proposalsSorted = renderedProposals.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const dispatch = useDispatch();

  const loadProposals = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('UserProposalsScreen: fetching Proposals');
      dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  const searchHandler = (text) => {
    const newData = renderedProposals.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProposals(text.length ? newData : userProposals);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (itemData) => {
    props.navigation.navigate('ProposalDetail', {
      itemData: itemData,
    });
  };

  if (error) {
    return <Error actionOnPress={loadProposals} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && userProposals.length === 0) {
    return <EmptyState text="Inga efterlysningar ännu, prova lägga till några." />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland dina efterlysningar"
      />
      <HeaderTwo
        title="Mina efterlysningar"
        subTitle="Alla efterlysningar du själv har lagt upp, lösta och olösta"
        indicator={proposalsSorted.length ? proposalsSorted.length : 0}
      />
      <FlatList
        initialNumToRender={8}
        horizontal={false}
        numColumns={1}
        onRefresh={loadProposals}
        refreshing={isRefreshing}
        data={proposalsSorted}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProposalItem
            navigation={props.navigation}
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item);
            }}
          />
        )}
      />
    </SaferArea>
  );
};

export default UserProposalsScreen;
