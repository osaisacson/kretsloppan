import { Entypo } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
//Components
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import HeaderTwo from '../../components/UI/HeaderTwo';
import Loader from '../../components/UI/Loader';
import ProjectItem from '../../components/UI/ProjectItem';
import SaferArea from '../../components/UI/SaferArea';
import SearchBar from '../../components/UI/SearchBar';
//Actions
import * as projectsActions from '../../store/actions/projects';

const ProjectsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get original projects from state
  const projects = useSelector((state) => state.projects.availableProjects);

  //Prepare for changing the rendered projects on search
  const [renderedProjects, setRenderedProjects] = useState(projects);
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

  const searchHandler = (text) => {
    const newData = renderedProjects.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProjects(text.length ? newData : projects);
    setSearchQuery(text.length ? text : '');
  };

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
    return <EmptyState text="Inga projekt hittade." />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        placeholder="Leta bland projekt"
        searchQuery={searchQuery}
      />
      <FlatList
        ListHeaderComponent={
          <HeaderTwo
            buttonIcon="plus"
            buttonOnPress={() => props.navigation.navigate('EditProject')}
            buttonText="Projekt"
            icon={
              <Entypo
                name="tools"
                size={20}
                style={{
                  marginRight: 5,
                }}
              />
            }
            indicator={renderedProjects.length ? renderedProjects.length : 0}
            subTitle="Projekt byggda med återbruk"
            title="Projekt"
          />
        }
        data={renderedProjects}
        horizontal={false}
        initialNumToRender={4}
        keyExtractor={(item) => item.id}
        numColumns={1}
        onRefresh={loadProjects}
        refreshing={isRefreshing}
        renderItem={(itemData) => (
          <ProjectItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
            }}
          />
        )}
      />
    </SaferArea>
  );
};

export default ProjectsScreen;
