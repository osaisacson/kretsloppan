import React, { useState } from 'react';
import useGetProjects from '../hooks/useGetProjects';
import { FlatList, StyleSheet, View } from 'react-native';

import { createFilter } from 'react-native-search-filter';
import SaferArea from '../components/wrappers/SaferArea';
import Error from '../components/UI/Error';
import Loader from '../components/UI/Loader';
import EmptyState from '../components/UI/EmptyState';
import HeaderTwo from '../components/UI/HeaderTwo';
import SearchBar from '../components/UI/SearchBar';
import ProjectItem from '../components/UI/ProjectItem';
import { Divider } from 'react-native-paper';
import ProductAvatarAndLocation from '../components/UI/ProductAvatarAndLocation';

const ProjectsScreen = ({ navigation }) => {
  const { status, data, isLoading, error } = useGetProjects();
  console.log('Fetching projects in ProjectsScreen via the useGetProjects hook...');

  //Prepare for changing the rendered projects on search
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

  if (isLoading) {
    return <EmptyState text="Hämtar projekt" />;
  }

  //Set which fields to filter by
  const KEYS_TO_FILTERS = ['title', 'location', 'description', 'slogan', 'status'];

  const filteredProjectsRaw = data.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

  const filteredProjects = filteredProjectsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const selectItemHandler = (itemData) => {
    props.navigation.navigate('ProjectDetail', {
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
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <>
            <Divider
              style={{
                marginBottom: 10,
              }}
            />
            <View style={styles.container}>
              <ProductAvatarAndLocation navigation={navigation} itemData={itemData.item} />
              <ProjectItem
                cardHeight={200}
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
            simpleCount={filteredProjects.length}
            showAddLink={() => navigation.navigate('EditProject')}
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
    marginBottom: 75,
  },
});

export default ProjectsScreen;
