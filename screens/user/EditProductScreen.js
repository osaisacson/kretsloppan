import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Picker
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import CATEGORIES from '../../data/dummy-data';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');

  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [categoryName, setCategoryName] = useState(
    editedProduct ? editedProduct.categoryName : ''
  );

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');

  const [imageUrl, setImageUrl] = useState(
    editedProduct ? editedProduct.imageUrl : ''
  );

  const [price, setPrice] = useState('');

  const [description, setDescription] = useState(
    editedProduct ? editedProduct.description : ''
  );

  //Add or edit a product
  const submitHandler = useCallback(() => {
    //if editedProduct is true we are editing, else we are adding

    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(
          prodId,
          title,
          description,
          imageUrl,
          categoryName
        )
      );
    } else {
      dispatch(
        productsActions.createProduct(
          title,
          description,
          imageUrl,
          +price,
          categoryName
        )
      );
    }
    props.navigation.goBack(); //Goes back to the previous screen after the above action has been performed
  }, [dispatch, prodId, title, description, imageUrl, price, categoryName]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Category</Text>

          <Picker
            selectedValue={categoryName}
            onValueChange={text => setCategoryName(text)}
          >
            {/* NOTE: These are hardcoded to match the categories defined in the categories dummy data. They shalt not be hardcoded in the end. */}
            <Picker.Item label="Tak" value="Tak" />
            <Picker.Item label="Grund" value="Grund" />
            <Picker.Item label="Fönster" value="Fönster" />
            <Picker.Item label="Maskiner" value="Maskiner" />
            <Picker.Item label="Diverse" value="Diverse" />
          </Picker>
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={text => setTitle(text)}
            keyboardType="default"
            autoCapitalize="sentences"
            returnKeyType="next"
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={text => setImageUrl(text)}
            returnKeyType="next"
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={text => setPrice(text)}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={text => setDescription(text)}
            returnKeyType="done"
          />
        </View>
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});

export default EditProductScreen;
