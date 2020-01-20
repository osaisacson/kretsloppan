import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList, Button, Platform, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import CategoryGridTile from '../../components/UI/CategoryGridTile';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as categoriesActions from '../../store/actions/categories';

//This screen shows the categories which have been uploaded by the user
const CategoriesScreen = props => {
  //check if we are loading
  const [isLoading, setIsLoading] = useState(false);
  //check if we get any errors
  const [error, setError] = useState();

  //get a slice of the categories state
  const categories = useSelector(state => state.categories.categories);
  const dispatch = useDispatch();

  //Runs whenever the component is loaded, and fetches the latest categories
  const loadCategories = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(categoriesActions.fetchCategories());
    } catch (err) {
      console.log('Cannot fetch categories');
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  //Update the menu when there's new data: when the screen focuses (see docs for other options, like onBlur), call loadCategories again
  useEffect(() => {
    const willFocusSubscription = props.navigation.addListener(
      'willFocus',
      loadCategories
    );
    //Cleanup afterwards. Removes the subscription
    return () => {
      willFocusSubscription.remove();
    };
  }, [loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [dispatch, loadCategories]);

  //Om något gick fel, visa ett error message
  if (error) {
    return <Error actionOnPress={loadCategories} />;
  }

  //Om vi inte har några produkter än: visa ett empty state
  if (!isLoading && (categories.length === 0 || !categories)) {
    return <EmptyState>Inget här ännu</EmptyState>;
  }

  //Vissa en spinner när vi laddar produkter
  if (isLoading) {
    return <Loader />;
  }

  //Show an alert when trying to delete a category
  const deleteHandler = id => {
    Alert.alert(
      'Are you sure?',
      "Do you really want to delete this item? There's no going back.",
      [
        { text: 'Nope', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            dispatch(categoriesActions.deleteCategory(id));
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

CategoriesScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Redigera Kategorier',
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

export default CategoriesScreen;
