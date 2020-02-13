import React from 'react';

import { View, Platform, StyleSheet } from 'react-native';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import AddButton from '../../components/UI/AddButton';
import UserAvatar from '../../components/UI/UserAvatar';
import ContentHeader from '../../components/UI/ContentHeader';
import HeaderButton from '../../components/UI/HeaderButton';
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

ProjectsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Allt Återbruk',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <UserAvatar
        showBadge={true}
        actionOnPress={() => {
          navData.navigation.navigate('Profil');
        }}
      />
    )
  };
};

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    width: '100%'
  },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProjectsScreen;
