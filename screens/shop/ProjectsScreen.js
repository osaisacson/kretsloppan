import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import AddButton from '../../components/UI/AddButton';
import ContentHeader from '../../components/UI/ContentHeader';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ProjectItem from '../../components/UI/ProjectItem';
//Actions
import * as projectsActions from '../../store/actions/projects';
//Constants
import Colors from '../../constants/Colors';

const ProjectsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const projects = useSelector(state => state.projects.availableProjects);

  const projectsSorted = projects.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
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

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProjectDetail', {
      projectId: id,
      ownerId: ownerId,
      projectTitle: title
    });
  };

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
      <View>
        <ContentHeader
          title={'Projekt'}
          subTitle={'Projekt som håller på att byggas med återbruk'}
          indicator={projectsSorted.length ? projectsSorted.length : 0}
        />
        <FlatList
          horizontal={false}
          numColumns={1}
          onRefresh={loadProjects}
          refreshing={isRefreshing}
          data={projectsSorted}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <ProjectItem
              project={itemData}
              onSelect={() => {
                selectItemHandler(
                  itemData.item.id,
                  itemData.item.ownerId,
                  itemData.item.title
                );
              }}
            ></ProjectItem>
          )}
        />
      </View>
      <AddButton navigation={props.navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProjectsScreen;
