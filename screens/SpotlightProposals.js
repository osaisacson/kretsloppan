import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetProposals from '../hooks/useGetProposals';

import { FlatList, View, StyleSheet, Text } from 'react-native';

import HeaderTwo from '../components/UI/HeaderTwo';
import EmptyState from '../components/UI/EmptyState';
import ProposalItem from '../components/UI/ProposalItem';
import ButtonSeeMore from '../components/UI/ButtonSeeMore';

const SpotlightProposals = () => {
  const { isLoading, isError, data, error } = useGetProposals();

  const navigation = useNavigation();

  const selectItemHandler = (itemData) => {
    navigation.navigate('ProposalDetail', {
      itemData: itemData,
    });
  };

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log('Loading proposals in SpotlightProposals via the useGetProposals hook...');
    return <EmptyState text="Hämtar efterlysningar" />;
  }

  console.log('Proposals found: ', data.length);

  const recentActiveProposals = data.filter((proposal) => proposal.status !== 'löst');

  const recentProposalsSorted = recentActiveProposals.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProposals = recentProposalsSorted.slice(0, 3);

  return (
    <FlatList
      listKey="proposalsFlatlist"
      numColumns={1}
      data={recentProposals}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <>
          <View style={styles.container}>
            <ProposalItem
              hideInfo
              cardHeight={55}
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
          title={'Efterlysningar'}
          showAddLink={() => navigation.navigate('EditProject')}
          icon={
            <MaterialCommunityIcons
              name="alert-decagram-outline"
              size={24}
              style={{
                marginRight: 3,
                marginBottom: 2,
              }}
            />
          }
        />
      }
      ListFooterComponent={
        <ButtonSeeMore
          nrToShow={data.length > 1 ? data.length : null}
          onSelect={data.length > 1 ? () => navigation.navigate('Efterlysningar') : false}
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

export default SpotlightProposals;
