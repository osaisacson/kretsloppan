import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput
} from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import { MaterialIcons } from '@expo/vector-icons';

//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const UserProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get user products with the status 'redo' or 'bearbetas'
  const userProducts = useSelector(state => state.products.userProducts);
  //Prepare for changing the rendered products on search
  const [renderedProducts, setRenderedProducts] = useState(userProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const productsSorted = renderedProducts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProducts);
    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const searchHandler = text => {
    const newData = renderedProducts.filter(item => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProducts(text.length ? newData : userProducts);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (id, ownerId, title, detailPath) => {
    props.navigation.navigate(detailPath, {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState text="Inga produkter ännu, prova lägga till några." />;
  }

  return (
    <SaferArea>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={text => searchHandler(text)}
        value={searchQuery}
        underlineColorAndroid="transparent"
        placeholder="Leta bland ditt återbruk"
      />
      <HeaderTwo
        title={'Ditt upplagda återbruk'}
        subTitle={
          'Allt som är redo att hämtas, håller på att bearbetas, eller har blivit hämtat.'
        }
        icon={
          <MaterialIcons
            name="file-upload"
            size={20}
            style={{ marginRight: 5 }}
          />
        }
        indicator={productsSorted.length ? productsSorted.length : 0}
      />
      <FlatList
        horizontal={false}
        numColumns={3}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={productsSorted}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <ProductItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title,
                'ProductDetail'
              );
            }}
          ></ProductItem>
        )}
      />
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textStyle: {
    padding: 10
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF'
  }
});

export default UserProductsScreen;
