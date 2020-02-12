import React from 'react';
//Components
import { Button, Alert, ScrollView, View, StyleSheet } from 'react-native';
import ProductItem from '../../components/shop/ProductItem';
import ContentHeader from '../../components/UI/ContentHeader';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const HorizontalScroll = props => {
  const scrollData = props.scrollData;

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title
    });
  };

  //Delete a product. Show an alert first.
  const deleteHandler = id => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här produkten? Du kan inte gå tillbaka.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja',
          style: 'destructive',
          onPress: () => {
            dispatch(productsActions.deleteProduct(id));
          }
        }
      ]
    );
  };

  //Navigate to the edit screen and forward the product id
  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  return (
    <ScrollView scrollEventThrottle={16}>
      <ContentHeader
        title={props.title}
        subTitle={props.subTitle}
        extraSubTitle={props.extraSubTitle}
        indicator={scrollData.length ? scrollData.length : 0}
      />
      <View style={styles.horizontalScrollContainer}>
        <View style={styles.horizontalScroll}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {scrollData.map(prod => (
              <ProductItem
                key={prod.id}
                isHorizontal={true}
                image={prod.imageUrl}
                title={prod.title}
                price={prod.price ? prod.price : 0}
                onSelect={() => {
                  props.showEditAndDelete
                    ? editProductHandler(prod.id)
                    : selectItemHandler(prod.id, prod.title);
                }}
              >
                {props.showEditAndDelete ? (
                  <>
                    <Button
                      color={Colors.primary}
                      title="Edit"
                      onPress={() => {
                        editProductHandler(prod.id);
                      }}
                    />
                    <Button
                      color={Colors.primary}
                      title="Delete"
                      onPress={deleteHandler.bind(this, prod.id)}
                    />
                  </>
                ) : null}
              </ProductItem>
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalScrollContainer: {
    flex: 1,
    height: 200
  },
  horizontalScroll: {
    height: 200,
    marginTop: 20
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default HorizontalScroll;
