import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import React from 'react';
import useGetProjects from '../../hooks/useGetProjects';

import { FlatList, View, StyleSheet } from 'react-native';

import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import ProjectItem from '../../components/UI/ProjectItem';
import ButtonSeeMore from '../../components/UI/ButtonSeeMore';

const SpotlightProjects = () => {
  const { isLoading, isError, data, error } = useGetProjects();

  const navigation = useNavigation();

  const selectItemHandler = (itemData) => {
    navigation.navigate('ProjectDetail', {
      itemData: itemData,
    });
  };

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log('Loading projects in SpotlightProjects via the useGetProjects hook...');
    return <EmptyState text="Hämtar projekt" />;
  }

  console.log('Projects found: ', data.length);

  const recentProjectsSorted = data.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProjects = recentProjectsSorted.slice(0, 1);

  return (
    <FlatList
      listKey="projectsFlatlist"
      numColumns={1}
      data={recentProjects}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <>
          <View style={styles.container}>
            <ProjectItem
              hideInfo
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
          title={'Projekt'}
          showAddLink={() => navigation.navigate('EditProject')}
          icon={
            <FontAwesome5
              name="tools"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
      }
      ListFooterComponent={
        <ButtonSeeMore
          nrToShow={data.length > 1 ? data.length : null}
          onSelect={data.length > 1 ? () => navigation.navigate('Projekt') : false}
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

export default SpotlightProjects;
