import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import ProposalItem from '../../components/UI/ProposalItem';
import SearchBar from '../../components/UI/SearchBar';
import { Entypo } from '@expo/vector-icons';
//Actions
import * as proposalsActions from '../../store/actions/proposals';
//Constants
import Colors from '../../constants/Colors';

const ProposalsScreen = (props) => {
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  //Get original proposals from state
  const proposals = useSelector((state) => state.proposals.availableProposals);
  //Prepare for changing the rendered proposals on search
  const [renderedProposals, setRenderedProposals] = useState(proposals);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const loadProposals = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('ProposalsScreen: fetching Proposals');
      await dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    console.log(
      'Proposals: running useEffect where we setRenderedProducts to proposals'
    );
    setRenderedProposals(proposals);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProposals);
    return () => {
      unsubscribe();
    };
  }, [loadProposals]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProposals().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [dispatch, loadProposals]);

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
    return <Error actionOnPress={loadProducts} />;
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
        initialNumToRender={20}
        onRefresh={loadProposals}
        refreshing={isRefreshing}
        data={renderedProposals}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProposalItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title
              );
            }}
          ></ProposalItem>
        )}
        ListHeaderComponent={
          <HeaderTwo
            title={'Efterlysningar'}
            subTitle={'Efterlysningar av självbyggare'}
            questionText={'Här ska det vara en förklaring'}
            icon={
              <Entypo
                name={'tools'}
                size={20}
                style={{
                  transform: [{ rotate: '90deg' }],
                  marginRight: 5,
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
