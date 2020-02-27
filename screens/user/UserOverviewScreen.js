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
import Styles from '../../constants/Styles';

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
            style={{
              color: '#fff',
              backgroundColor: '#fff',
              borderWidth: '0.3',
              borderColor: '#000'
            }}
            source={require('./../../assets/egnahemsfabriken.png')}
            size={50}
          />
        </Button>
        <Title style={styles.title}>Egnahemsfabriken</Title>
        <View style={styles.row}>
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
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>22</Paragraph>
            <Caption style={styles.caption}>Projekt</Caption>
          </View>
        </View>
      </View>
      <Tab.Navigator
        initialRouteName="Min Sida"
        tabBarOptions={{
          tabStyle: {
            backgroundColor: Colors.primary
          },
          labelStyle: {
            fontSize: 15,
            fontFamily: 'roboto-regular',
            textTransform: 'capitalize'
          },
          activeTintColor: '#fff',
          inactiveTintColor: '#a4a9ac',
          indicatorStyle: { backgroundColor: '#fff' }
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
    marginTop: -6,
    paddingLeft: Styles.leftRight
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -6
  },
  row: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Styles.leftRight
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 3
  }
});

export const screenOptions = navData => {
  return {
    headerTitle: '', //TBD dynamic title of logged in user's userName
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
