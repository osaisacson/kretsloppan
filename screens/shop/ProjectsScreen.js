import React from 'react';

import { View, Platform, StyleSheet } from 'react-native';

//Components
import AddButton from '../../components/UI/AddButton';
import ContentHeader from '../../components/UI/ContentHeader';
import EmptyState from '../../components/UI/EmptyState';

const ProjectsScreen = props => {
  return (
    <View style={styles.gridContainer}>
      <ContentHeader
        title={'Projekt'}
        subTitle={'Pågående projekt med återbruk'}
        indicator={0}
      />
      <EmptyState>Inget här ännu</EmptyState>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    width: '100%'
  },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProjectsScreen;
