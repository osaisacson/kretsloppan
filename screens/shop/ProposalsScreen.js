import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput
} from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ProposalItem from '../../components/UI/ProposalItem';
import { Ionicons } from '@expo/vector-icons';
//Actions
import * as proposalsActions from '../../store/actions/proposals';
//Constants
import Colors from '../../constants/Colors';

const ProposalsScreen = props => {
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  //Get original proposals from state
  const proposals = useSelector(state => state.proposals.availableProposals);
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

  const searchHandler = text => {
    const newData = renderedProposals.filter(item => {
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
      detailTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProposals}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && proposals.length === 0) {
    return <EmptyState text="Inga efterlysningar hittade." />;
  }

  return (
    <SaferArea>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={text => searchHandler(text)}
        value={searchQuery}
        underlineColorAndroid="transparent"
        placeholder="Leta bland efterlysningar"
      />
      <HeaderTwo
        title={'Efterlysningar'}
        subTitle={'Efterlysningar av självbyggare'}
        questionText={'Här ska det vara en förklaring'}
        icon={
          <Ionicons
            name="ios-notifications"
            size={20}
            style={{ marginRight: 5 }}
          />
        }
        indicator={renderedProposals.length ? renderedProposals.length : 0}
      />
      <FlatList
        style={{ marginTop: 30 }}
        horizontal={false}
        numColumns={1}
        initialNumToRender={20}
        onRefresh={loadProposals}
        refreshing={isRefreshing}
        data={proposals}
        extraData={proposals}
        keyExtractor={item => item.id}
        renderItem={itemData => (
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
      />
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textStyle: {
    padding: 10
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF'
  }
});

export default ProposalsScreen;
