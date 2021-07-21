// import React, { useState, useCallback } from 'react';
// import { FlatList } from 'react-native';
// import { createFilter } from 'react-native-search-filter';
// import { useSelector, useDispatch } from 'react-redux';

// import EmptyState from '../../components/UI/EmptyState';
// import Error from '../../components/UI/Error';
// import HeaderTwo from '../../components/UI/HeaderTwo';
// import Loader from '../../components/UI/Loader';
// import SearchBar from '../../components/UI/SearchBar';
// import ProposalItem from '../../components/UI/ProposalItem';
// import SaferArea from '../../components/wrappers/SaferArea';
// import * as proposalsActions from '../../store/actions/proposals';

// const ProposalsScreen = (props) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState();

//   //Get original proposals from state
//   const proposals = useSelector((state) => state.proposals.availableProposals);

//   //Prepare for changing the rendered proposals on search
//   const [searchQuery, setSearchQuery] = useState('');

//   const dispatch = useDispatch();

//   //Load proposals
//   const loadProposals = useCallback(async () => {
//     setError(null);
//     setIsRefreshing(true);
//     try {
//       console.log('ProposalsScreen: fetching proposals...');
//       dispatch(proposalsActions.fetchProposals());
//     } catch (err) {
//       setError(err.message);
//     }
//     setIsRefreshing(false);
//   }, [dispatch, setIsLoading, setError]);

//   //Set which fields to filter by
//   const KEYS_TO_FILTERS = ['title', 'description', 'price', 'status'];

//   const filteredProposalsRaw = proposals.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

//   const filteredProposals = filteredProposalsRaw.sort(function (a, b) {
//     a = new Date(a.date);
//     b = new Date(b.date);
//     return a > b ? -1 : a < b ? 1 : 0;
//   });

//   const selectItemHandler = (itemData) => {
//     props.navigation.navigate('ProposalDetail', {
//       itemData: itemData,
//     });
//   };

//   if (error) {
//     return <Error actionOnPress={loadProposals} />;
//   }

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (!isLoading && proposals.length === 0) {
//     return <EmptyState text="Hittade inga efterlysningar." />;
//   }

//   return (
//     <SaferArea>
//       <SearchBar
//         placeholder="Leta bland efterlysningar: titel, beskrivning..."
//         onChangeText={(term) => setSearchQuery(term.length ? term : '')}
//       />

//       <FlatList
//         numColumns={1}
//         initialNumToRender={10}
//         onRefresh={loadProposals}
//         refreshing={isRefreshing}
//         data={filteredProposals}
//         keyExtractor={(item) => item.id}
//         renderItem={(itemData) => (
//           <ProposalItem
//             itemData={itemData.item}
//             onSelect={() => {
//               selectItemHandler(itemData.item);
//             }}
//           />
//         )}
//         ListHeaderComponent={
//           <HeaderTwo
//             isSearch
//             showAddLink={() => props.navigation.navigate('EditProposal')}
//             simpleCount={filteredProposals.length}
//             indicator={filteredProposals.length ? filteredProposals.length : 0}
//           />
//         }
//       />
//     </SaferArea>
//   );
// };

// export default ProposalsScreen;

import React, { useState } from 'react';
import useGetProposals from './../../hooks/useGetProposals';
import { FlatList, StyleSheet, View } from 'react-native';

import { createFilter } from 'react-native-search-filter';
import SaferArea from '../../components/wrappers/SaferArea';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import EmptyState from '../../components/UI/EmptyState';
import HeaderTwo from '../../components/UI/HeaderTwo';
import SearchBar from '../../components/UI/SearchBar';
import ProposalItem from '../../components/UI/ProposalItem';
import { Divider } from 'react-native-paper';

const ProposalsScreen = ({ navigation }) => {
  const { status, data, isFetching, error } = useGetProposals();
  console.log('...fetching proposals in ProposalsScreen via the useGetProposals hook: ', status);

  //Prepare for changing the rendered proposals on search
  const [searchQuery, setSearchQuery] = useState('');

  if (status === 'error') {
    console.log('ERROR: ', error.message);
    return <Error />;
  }

  if (status === 'loading') {
    return <Loader />;
  }

  if (!(status === 'loading') && data.length === 0) {
    return <EmptyState text="Hittade inga projekt." />;
  }

  if (isFetching) {
    return <EmptyState text="Background updating" />;
  }

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
        refreshing={isFetching}
        data={filteredProposals}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <>
            <Divider
              style={{
                marginBottom: 10,
              }}
            />
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

export default ProposalsScreen;
