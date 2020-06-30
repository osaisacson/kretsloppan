import { useNavigation } from '@react-navigation/native';
import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Alert, Text } from 'react-native';
import { Divider, Title, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

//Imports
import ButtonIcon from '../../components/UI/ButtonIcon';
import CachedImage from '../../components/UI/CachedImage';
import FilterLine from '../../components/UI/FilterLine';
import HeaderThree from '../../components/UI/HeaderThree';
import SectionCard from '../../components/UI/SectionCard';
import { DetailWrapper, detailStyles } from '../../components/wrappers/DetailWrapper';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';
import ProductButtonLogic from './ProductButtonLogic';

const ProductDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const productId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Find us the product that matches the current productId
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  if (!selectedProduct) {
    return null;
  }

  const {
    category,
    color,
    condition,
    date,
    description,
    background,
    height,
    id,
    image,
    internalComments,
    length,
    material,
    price,
    priceText,
    status,
    style,
    title,
    width,
  } = selectedProduct;

  //Check status of product and privileges of user
  const hasEditPermission = ownerId === loggedInUserId;
  const isPickedUp = status === 'hämtad';

  const editProductHandler = (id) => {
    navigation.navigate('EditProduct', { detailId: id });
  };

  const deleteHandler = () => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här produkten? Det går inte att gå ändra sig när det väl är gjort.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            dispatch(productsActions.deleteProduct(id));
          },
        },
      ]
    );
  };

  return (
    <DetailWrapper>
      <View>
        {/* Buttons for handling reservation, coordination and collection */}
        <ProductButtonLogic
          selectedProduct={selectedProduct}
          hasEditPermission={hasEditPermission}
          navigation={props.navigation}
        />
        <SectionCard>
          {/* Product image */}
          <CachedImage style={detailStyles.image} uri={image ? image : ''} />

          {/* Show delete and edit buttons if the user has editing 
        permissions and the product is not yet picked up */}
          {hasEditPermission && !isPickedUp ? (
            <View style={detailStyles.editOptions}>
              <ButtonIcon
                icon="delete"
                color={Colors.warning}
                onSelect={() => {
                  deleteHandler(selectedProduct.id);
                }}
              />
              <ButtonIcon
                icon="pen"
                color={Colors.neutral}
                onSelect={() => {
                  editProductHandler(selectedProduct.id);
                }}
              />
            </View>
          ) : null}

          {/* General description */}
          <Title>{title}</Title>
          {description ? (
            <>
              <Divider style={{ marginVertical: 10 }} />
              <Paragraph>{description}</Paragraph>
            </>
          ) : null}
          {/* Internal listing information.*/}
          {internalComments ? (
            <>
              <Divider style={{ marginVertical: 10 }} />
              <View style={detailStyles.spaceBetweenRow}>
                <Paragraph>Intern referens:</Paragraph>
                <Paragraph>{internalComments}</Paragraph>
              </View>
            </>
          ) : null}
          {background ? (
            <>
              <Divider style={{ marginBottom: 10 }} />
              <View>
                <HeaderThree text="Kuriosa/Historik" />
                <Paragraph>{background}</Paragraph>
              </View>
            </>
          ) : null}
          {length || height || width ? (
            <>
              <Divider style={{ marginTop: 10 }} />
              <HeaderThree style={{ marginVertical: 10 }} text="Mått" />
            </>
          ) : null}
          {length ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Längd:</Paragraph>
              <Paragraph>{length}mm</Paragraph>
            </View>
          ) : null}
          {height ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Höjd:</Paragraph>
              <Paragraph>{height}mm</Paragraph>
            </View>
          ) : null}
          {width ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Bredd:</Paragraph>
              <Paragraph>{width}mm</Paragraph>
            </View>
          ) : null}
          <Divider style={{ marginTop: 10 }} />

          {/* Only show filter badges if we have any filters */}
          {category || condition || style || material || color ? (
            <>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {category === 'Ingen' ? null : <FilterLine filter={category} />}
                {condition === 'Inget' ? null : <FilterLine filter={`${condition} skick`} />}
                {style === 'Ingen' ? null : <FilterLine filter={style} />}
                {material === 'Inget' ? null : <FilterLine filter={material} />}
                {color === 'Ingen' ? null : <FilterLine filter={color} />}
              </View>
              <Divider style={{ marginBottom: 10 }} />
            </>
          ) : null}

          {/* Price */}
          {price || priceText ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Title>Pris:</Title>
              <Paragraph style={{ textAlign: 'right', padding: 20 }}>
                {price ? `${price} kr` : priceText}
              </Paragraph>
            </View>
          ) : null}
        </SectionCard>
        <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
          Upplagt {Moment(date).locale('sv').startOf('hour').fromNow()}
        </Text>
      </View>
    </DetailWrapper>
  );
};

export default ProductDetailScreen;
