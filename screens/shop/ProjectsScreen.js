import React, { useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { createFilter } from 'react-native-search-filter';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import ProjectItem from '../../components/UI/ProjectItem';
import SearchBar from '../../components/UI/SearchBar';
import * as projectsActions from '../../store/actions/projects';

const ProjectsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get original projects from state
  const projects = useSelector((state) => state.projects.availableProjects);

  //Prepare for changing the rendered projects on search
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  //Load projects
  const loadProjects = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('ProjectsScreen: fetching projects...');
      dispatch(projectsActions.fetchProjects());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  //Set which fields to filter by
  const KEYS_TO_FILTERS = ['title', 'location', 'description', 'slogan', 'status'];

  const filteredProjectsRaw = projects.filter(createFilter(searchQuery, KEYS_TO_FILTERS));

  const filteredProjects = filteredProjectsRaw.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProjectDetail', {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  if (error) {
    return <Error actionOnPress={loadProjects} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && projects.length === 0) {
    return <EmptyState text="Hittade inga projekt." />;
  }

  return (
    <View>
      <SearchBar
        placeholder="Leta bland projekt: titel, plats..."
        onChangeText={(term) => setSearchQuery(term.length ? term : '')}
      />

      <FlatList
        numColumns={1}
        initialNumToRender={6}
        onRefresh={loadProjects}
        refreshing={isRefreshing}
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <ProjectItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
            }}
          />
        )}
        ListHeaderComponent={
          <HeaderTwo
            isSearch
            showAddLink={() => props.navigation.navigate('EditProject')}
            simpleCount={filteredProjects.length}
            indicator={filteredProjects.length ? filteredProjects.length : 0}
          />
        }
      />
    </View>
  );
};

export default ProjectsScreen;
