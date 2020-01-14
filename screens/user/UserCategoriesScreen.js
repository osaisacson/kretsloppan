import React from 'react';
import { FlatList, Button, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import CategoryGridTile from '../../components/UI/CategoryGridTile';
import Colors from '../../constants/Colors';
import * as categoryActions from '../../store/actions/categories';

//This screen shows the products which have been uploaded by the user
const UserCategoriesScreen = props => {
  const categories = useSelector(state => state.categories.categories);
  const dispatch = useDispatch();

  //Show an alert when trying to delete a product
  const deleteHandler = id => {
    Alert.alert(
      'Are you sure?',
      "Do you really want to delete this category? There's no going back.",
      [
        { text: 'Nope', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(categoryActions.deleteCategory(id));
          }
        }
      ]
    );
  };

  const editCategoryHandler = id => {
    props.navigation.navigate('EditCategory', { categoryId: id }); //Navigate to the edit screen and forward the category id
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <CategoryGridTile
          title={itemData.item.categoryName}
          color={itemData.item.color}
          onSelect={() => {
            editCategoryHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editCategoryHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </CategoryGridTile>
      )}
    />
  );
};

UserCategoriesScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Redigera kategorier',
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
          title="Lägg till"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditCategory');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default UserCategoriesScreen;
