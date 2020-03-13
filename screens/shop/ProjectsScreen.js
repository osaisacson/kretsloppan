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
import ProjectItem from '../../components/UI/ProjectItem';
import { Ionicons } from '@expo/vector-icons';
//Actions
import * as projectsActions from '../../store/actions/projects';
//Constants
import Colors from '../../constants/Colors';

const ProjectsScreen = props => {
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  //Get original projects from state
  const projects = useSelector(state => state.projects.availableProjects);
  //Prepare for changing the rendered projects on search
  const [renderedProjects, setRenderedProjects] = useState(projects);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const loadProjects = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('ProjectsScreen: fetching projects');
      await dispatch(projectsActions.fetchProjects());
    } catch (err) {
      setError(err.message);
    }
    setRenderedProjects(projects);
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    console.log(
      'ProjectsScreen: running useEffect where we setRenderedProjects to projects'
    );
    setRenderedProjects(projects);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProjects);
    return () => {
      unsubscribe();
    };
  }, [loadProjects]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProjects().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [dispatch, loadProjects]);

  const searchHandler = text => {
    const newData = renderedProjects.filter(item => {
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
    return <EmptyState text="Inga produkter hittade." />;
  }

  return (
    <SaferArea>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={text => searchHandler(text)}
        value={searchQuery}
        underlineColorAndroid="transparent"
        placeholder="Leta efter projekt"
      />
      <HeaderTwo
        title={'Projekt'}
        subTitle={'Projekt byggda med återbruk'}
        icon={
          <Ionicons name="ios-build" size={20} style={{ marginRight: 5 }} />
        }
        indicator={renderedProjects.length ? renderedProjects.length : 0}
      />
      <FlatList
        horizontal={false}
        numColumns={1}
        initialNumToRender={6}
        onRefresh={loadProjects}
        refreshing={isRefreshing}
        data={projects}
        extraData={projects}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <ProjectItem
            itemData={itemData.item}
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

export default ProjectsScreen;
