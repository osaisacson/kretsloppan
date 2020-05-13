import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import TextItem from '../../components/UI/TextItem';
import SearchBar from '../../components/UI/SearchBar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//Actions
import * as proposalsActions from '../../store/actions/proposals';

const ProposalsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get original proposals from state
  const proposals = useSelector((state) => state.proposals.availableProposals);

  //Prepare for changing the rendered proposals on search
  const [renderedProposals, setRenderedProposals] = useState(proposals);
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

  const searchHandler = (text) => {
    const newData = renderedProposals.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProposals(text.length ? newData : proposals);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProposalDetail', {
      detailId: id,
      ownerId: ownerId,
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
    return <EmptyState text="Inga efterlysningar hittade." />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland efterlysningar"
      />
      <FlatList
        horizontal={false}
        numColumns={1}
        initialNumToRender={10}
        onRefresh={loadProposals}
        refreshing={isRefreshing}
        data={renderedProposals}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <TextItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title
              );
            }}
          />
        )}
        ListHeaderComponent={
          <HeaderTwo
            title={'Efterlysningar'}
            subTitle={'Från självbyggare'}
            buttonIcon="plus"
            buttonText={'Efterlysning'}
            buttonOnPress={() => props.navigation.navigate('EditProposal')}
            icon={
              <MaterialCommunityIcons
                name={'alert-decagram-outline'}
                size={24}
                style={{
                  marginRight: 3,
                }}
              />
            }
            indicator={renderedProposals.length ? renderedProposals.length : 0}
          />
        }
      />
    </SaferArea>
  );
};

export default ProposalsScreen;
