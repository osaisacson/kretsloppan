import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Components
import { StyleSheet, View, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';

//Screens
import UserSpotlightScreen from './UserSpotlightScreen';
import UserProductsScreen from './UserProductsScreen';

//Constants
import Colors from '../../constants/Colors';
import Margins from '../../constants/Margins';

const UserOverviewScreen = props => {
  const Tab = createMaterialTopTabNavigator();

  //Navigate to the edit screen and forward the product id
  const editUserHandler = id => {
    props.navigation.navigate('EditUser');
  };

  return (
    <>
      <View style={styles.userInfoSection}>
        <Button mode="text" onPress={editUserHandler}>
          <Avatar.Image
            source={{
              uri:
                'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg'
            }}
            size={50}
          />
        </Button>
        {/* <Title style={styles.title}>Egnahemsfabriken</Title> */}
        {/* <View style={styles.row}>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>
              202
            </Paragraph>
            <Caption style={styles.caption}>Upplagda</Caption>
          </View>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>
              159
            </Paragraph>
            <Caption style={styles.caption}>Hämtade</Caption>
          </View>
        </View> */}
      </View>
      <Tab.Navigator
        initialRouteName="Min Sida"
        tabBarOptions={{
          labelStyle: {
            fontSize: 15,
            fontFamily: 'roboto-regular',
            textTransform: 'capitalize'
          },
          indicatorStyle: { backgroundColor: Colors.primary }
        }}
      >
        <Tab.Screen name="Min Sida" component={UserSpotlightScreen} />
        <Tab.Screen name="Mitt Förråd" component={UserProductsScreen} />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: Margins.leftRight
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center'
  },

  row: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Margins.leftRight
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 3
  },
  drawerSection: {
    marginTop: 15
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Margins.leftRight
  }
});

export const screenOptions = navData => {
  return {
    headerTitle: 'Egnahemsfabriken', //TBD dynamic title of logged in user's userName
    headerLeft: () => (
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Lägg till"
          iconName={
            Platform.OS === 'android' ? 'md-add-circle' : 'ios-add-circle'
          }
          onPress={() => {
            navData.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default UserOverviewScreen;
