import React, { useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import { createFilter } from 'react-native-search-filter';
import { useNavigation } from '@react-navigation/native';

import useGetProfiles from '../hooks/useGetProfiles';

import HeaderTwo from '../components/UI/HeaderTwo';
import Loader from '../components/UI/Loader';
import RoundItem from '../components/UI/RoundItem';
import SearchBar from '../components/UI/SearchBar';
import SaferArea from '../components/wrappers/SaferArea';

const ProfilesList = () => {
  const { isLoading, isError, data, error } = useGetProfiles();

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading profiles...`);
    return <Loader />;
  }

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = data.filter(createFilter(searchQuery, KEYS_TO_SEARCH_BY));

  const sortedProfiles = filteredProfiles.sort(function (a, b) {
    return b.profileName - a.profileName;
  });

  const navigation = useNavigation();

  //Set which fields to filter by
  const KEYS_TO_SEARCH_BY = [
    'profileName',
    'profileDescription',
    'email',
    'phone',
    'address',
    'location',
  ];

  const selectItemHandler = (itemData) => {
    navigation.navigate('Användare', {
      detailId: itemData.profileId,
    });
  };

  return (
    <SaferArea>
      <SearchBar
        placeholder="Leta bland användare: namn, beskrivning, address..."
        onChangeText={(term) => setSearchQuery(term)}
      />

      <FlatList
        initialNumToRender={10}
        horizontal={false}
        numColumns={1}
        data={sortedProfiles}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                borderBottom: 0.2,
                borderColor: '#666',
              }}>
              <RoundItem
                key={itemData.item.profileId}
                itemData={itemData.item}
                onSelect={() => {
                  selectItemHandler(itemData.item);
                }}
              />
              <Text style={{ alignSelf: 'center', paddingLeft: 10 }}>
                {itemData.item.profileName}
              </Text>
            </View>
            <Divider />
          </View>
        )}
        ListHeaderComponent={
          <HeaderTwo
            title="Alla användare"
            indicator={sortedProfiles.length ? sortedProfiles.length : 0}
          />
        }
      />
    </SaferArea>
  );
};

export default ProfilesList;
