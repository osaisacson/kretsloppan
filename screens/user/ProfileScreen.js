import React from 'react';
import { useSelector } from 'react-redux';
//Components
import { Text } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
//This screen shows the products which have been uploaded by the user
const ProfileScreen = props => {
  //get a slice of the profiles state
  const profile = useSelector(state => state.profiles.userProfile);
  console.log('SLICE PROFILES: ', profile);

  return <Text>Profile view</Text>;
};

ProfileScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Min  Profil',
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
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default ProfileScreen;
