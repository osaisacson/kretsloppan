import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Alert, Text } from 'react-native';
import { Divider, Title, Paragraph } from 'react-native-paper';
import Moment from 'moment/min/moment-with-locales';

import {
  DetailWrapper,
  detailStyles,
} from '../../components/wrappers/DetailWrapper';
import CachedImage from '../../components/UI/CachedImage';
import Loader from '../../components/UI/Loader';
import FilterLine from '../../components/UI/FilterLine';
import ProductButtonLogic from './ProductButtonLogic';
import ProductStatusLogic from './ProductStatusLogic';

import ButtonIcon from '../../components/UI/ButtonIcon';
import SectionCard from '../../components/UI/SectionCard';

//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const productId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;
  const loggedInUserId = useSelector((state) => state.auth.userId);

  //Set up state hooks
  const [isLoading, setIsLoading] = useState(false);

  //Find us the product that matches the current productId
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  const {
    category,
    color,
    collectingUserId,
    condition,
    date,
    description,
    height,
    id,
    image,
    internalComments,
    length,
    material,
    newOwnerId,
    price,
    projectId,
    status,
    style,
    title,
    reservedUserId,
    width,
  } = selectedProduct;

  //Get all projects from state, and then return the ones that matches the id of the current product
  const userProjects = useSelector((state) => state.projects.userProjects);
  const projectForProductSelection = userProjects.filter(
    (proj) => proj.id === projectId
  );

  const projectForProduct = projectForProductSelection[0];

  //Check status of product and privileges of user
  const hasEditPermission = ownerId === loggedInUserId;
  const isReserved = status === 'reserverad';
  const isOrganised = status === 'ordnad';
  const isPickedUp = status === 'hämtad';
  const isTouched = isReserved || isOrganised || isPickedUp;

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DetailWrapper>
      <View>
        <Text style={{ textAlign: 'right', color: '#666' }}>
          Upplagt {Moment(date).locale('sv').startOf('hour').fromNow()}
        </Text>

        {isTouched ? (
          <ProductStatusLogic selectedProduct={selectedProduct} />
        ) : null}

        <SectionCard>
          {/* Buttons for handling reservation, coordination and collection */}
          <ProductButtonLogic
            selectedProduct={selectedProduct}
            hasEditPermission={hasEditPermission}
            navigation={props.navigation}
          />
          {/* Product image */}
          <CachedImage style={detailStyles.image} uri={image ? image : ''} />

          {/* Show delete and edit buttons if the user has editing 
        permissions and the product is not yet picked up */}
          {hasEditPermission && !isPickedUp ? (
            <>
              <View style={detailStyles.editOptions}>
                <ButtonIcon
                  icon="pen"
                  color={Colors.neutral}
                  onSelect={() => {
                    editProductHandler(id);
                  }}
                />
                <ButtonIcon
                  icon="delete"
                  color={Colors.warning}
                  onSelect={deleteHandler.bind(this)}
                />
              </View>
            </>
          ) : null}
          {/* Internal listing information. Only show if user is owner */}
          {hasEditPermission && internalComments ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Intern listning:</Paragraph>
              <Paragraph>{internalComments}</Paragraph>
            </View>
          ) : null}
          {/* General description */}
          <Title>{title}</Title>
          <Paragraph>{description}</Paragraph>

          {length || height || width ? (
            <Divider style={{ marginVertical: 10 }} />
          ) : null}
          {length ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Längd:</Paragraph>
              <Paragraph>{length}</Paragraph>
            </View>
          ) : null}
          {height ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Höjd:</Paragraph>
              <Paragraph>{height}</Paragraph>
            </View>
          ) : null}
          {width ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Bredd:</Paragraph>
              <Paragraph>{width}</Paragraph>
            </View>
          ) : null}
          <Divider style={{ marginTop: 10 }} />

          {/* Only show filter badges if we have any filters */}
          {category || condition || style || material || color ? (
            <>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {category === 'Ingen' ? null : <FilterLine filter={category} />}
                {condition === 'Inget' ? null : (
                  <FilterLine filter={`${condition} skick`} />
                )}
                {style === 'Ingen' ? null : <FilterLine filter={style} />}
                {material === 'Inget' ? null : <FilterLine filter={material} />}
                {color === 'Ingen' ? null : <FilterLine filter={color} />}
              </View>
              <Divider style={{ marginBottom: 10 }} />
            </>
          ) : null}

          {/* Price */}
          <Paragraph style={{ textAlign: 'right', padding: 20 }}>
            {price ? `${price} kr` : 'Gratis'}
          </Paragraph>
        </SectionCard>
      </View>
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProductDetailScreen;
