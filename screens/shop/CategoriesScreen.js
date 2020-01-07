import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import { CATEGORIES } from '../../data/dummy-data';

import HeaderButton from '../../components/UI/HeaderButton';
import CategoryGridTile from '../../components/UI/CategoryGridTile';

const CategoriesScreen = props => {
  const renderGridItem = itemData => {
    return (
      <CategoryGridTile
        title={itemData.item.categoryName}
        color={itemData.item.color}
        onSelect={() => {
          props.navigation.navigate({
            routeName: 'ProductsOverview',
            params: {
              categoryName: itemData.item.categoryName //id of category, to be used when filtering the items in the next screen
            }
          });
        }}
      />
    );
  };

  return (
    <FlatList
      keyExtractor={(item, index) => item.id}
      data={CATEGORIES}
      renderItem={renderGridItem}
      numColumns={2}
    />
  );
};

//Overrides the default title being set in the ShopNavigator defaultNavigationOptions
CategoriesScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Kategorier',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer(); //Navigate nowhere, just open the sidedrawer
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
            navData.navigation.navigate('Cart'); //Go to cart on clicking the cart button
          }}
        />
      </HeaderButtons>
    )
  };
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CategoriesScreen;
