import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList } from 'react-native';
import { Banner } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import SearchBar from '../../components/UI/SearchBar';

//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const ProductsScreen = props => {
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  //Get original products from state
  const products = useSelector(state => state.products.availableProducts);
  //Prepare for changing the rendered products on search
  const [renderedProducts, setRenderedProducts] = useState(products);
  const [visibleBanner, setVisibleBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('ProductsScreen: fetching products');
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setRenderedProducts(products);
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    console.log(
      'ProductsScreen: running useEffect where we setRenderedProducts to products'
    );
    setRenderedProducts(products);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProducts);
    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProducts().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [dispatch, loadProducts]);

  const searchHandler = text => {
    const newData = renderedProducts.filter(item => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProducts(text.length ? newData : products);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title
    });
  };

  const introductionData = [
    {
      image:
        'https://images.unsplash.com/photo-1501366062246-723b4d3e4eb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1973&q=80',
      title: 'Välkommen!'
    },
    {
      image:
        'https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',

      title: 'Introduktion'
    },
    {
      image:
        'https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
      title: 'Avslutning'
    }
  ];

  if (error) {
    return <Error actionOnPress={loadProducts} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && products.length === 0) {
    return <EmptyState text="Inga produkter hittade." />;
  }

  return (
    <>
      <Banner
        visible={visibleBanner}
        actions={[
          {
            label: 'Stäng introduktionen',
            onPress: () => setVisibleBanner(false)
          }
        ]}
      >
        Här kan vi ha en liten introduktionstext med fina bilder.
      </Banner>

      <SaferArea>
        <SearchBar
          actionOnChangeText={text => searchHandler(text)}
          searchQuery={searchQuery}
          placeholder="Leta bland återbruk"
        />
        <FlatList
          numColumns={3}
          initialNumToRender={12}
          onRefresh={loadProducts}
          refreshing={isRefreshing}
          data={renderedProducts}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <ProductItem
              itemData={itemData.item}
              onSelect={() => {
                selectItemHandler(
                  itemData.item.id,
                  itemData.item.ownerId,
                  itemData.item.title
                );
              }}
            ></ProductItem>
          )}
          ListHeaderComponent={
            <HeaderTwo
              title={'Allt återbruk'}
              subTitle={
                'Ikonerna indikerar om de är under bearbetning, reserverade eller hämtade.'
              }
              questionText={'Här ska det vara en förklaring'}
              icon={
                <MaterialIcons
                  name="file-download"
                  size={20}
                  style={{ marginRight: 5 }}
                />
              }
              indicator={renderedProducts.length ? renderedProducts.length : 0}
            />
          }
        />
      </SaferArea>
    </>
  );
};

export default ProductsScreen;
