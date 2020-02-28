import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, Button } from 'react-native';
import HorizontalScroll from './HorizontalScroll';
import EmptyState from './EmptyState';
import Loader from './Loader';
//Actions
import * as projectsActions from '../../store/actions/projects';
//Constants
import Colors from '../../constants/Colors';

const ProjectsScroll = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const projects = useSelector(state => state.projects.availableProjects);

  const projectsSorted = projects.sort((a, b) => {
    return a.projectId > b.projectId ? 1 : -1;
  });

  const dispatch = useDispatch();

  const loadProjects = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(projectsActions.fetchProjects());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProjects);
    return () => {
      unsubscribe();
    };
  }, [loadProjects]);

  useEffect(() => {
    setIsLoading(true);
    loadProjects().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProjects]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProjects}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && projects.length === 0) {
    return <EmptyState text="Inga projekt ännu, prova lägga till ett." />;
  }

  return (
    <View>
      <HorizontalScroll
        isProject={true}
        title={'Projekt'}
        subTitle={'Projekt som håller på att byggas med återbruk'}
        scrollData={projectsSorted}
        navigation={props.navigation}
      />
    </View>
  );
};

export default ProjectsScroll;
