import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetProposals from '../hooks/useGetProposals';

import { FlatList, View, StyleSheet, Text } from 'react-native';

import HeaderTwo from '../components/UI/HeaderTwo';
import EmptyState from '../components/UI/EmptyState';
import ProposalItem from '../components/UI/ProposalItem';
import ButtonSeeMore from '../components/UI/ButtonSeeMore';

const SpotlightProposals = ({
  nrItemsToShow,
  projectId,
  title,
  showButtonAddNew,
  showButtonSeeMore,
}) => {
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

  //Only show proposals that belong to a specific project
  const proposals = projectId ? data.filter((proposal) => proposal.projectId === projectId) : data;

  if (projectId && !proposals.length) {
    console.log('Could not find any proposals.');
    return <EmptyState text="Inga efterlysningar i projektet ännu" />;
  }

  const sortedProposals = proposals.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProposals = nrItemsToShow ? sortedProposals.slice(0, nrItemsToShow) : sortedProposals;

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
          title={title}
          showAddLink={showButtonAddNew ? () => navigation.navigate('EditProject') : null}
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
        showButtonSeeMore ? (
          <ButtonSeeMore
            nrToShow={data.length > 1 ? data.length : null}
            onSelect={data.length > 1 ? () => navigation.navigate('Efterlysningar') : false}
          />
        ) : null
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
