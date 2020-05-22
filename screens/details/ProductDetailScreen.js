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
import ContactDetails from '../../components/UI/ContactDetails';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Loader from '../../components/UI/Loader';
import FilterLine from '../../components/UI/FilterLine';
import ProductButtonLogic from './ProductButtonLogic';
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

  //Get all projects from state, and then return the ones that matches the id of the current product
  const userProjects = useSelector((state) => state.projects.userProjects);
  const projectForProduct = userProjects.filter(
    (proj) => proj.id === selectedProduct.projectId
  );

  //Check status of product and privileges of user
  const hasEditPermission = ownerId === loggedInUserId;
  const isPickedUp = selectedProduct.status === 'hämtad';

  const editProductHandler = (id) => {
    navigation.navigate('EditProduct', { detailId: id });
  };

  const deleteHandler = () => {
    const id = selectedProduct.id;
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

  const { category, condition, style, material, color } = selectedProduct;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DetailWrapper>
      <View>
        <Text style={{ textAlign: 'right', color: '#666' }}>
          Upplagt{' '}
          {Moment(selectedProduct.date).locale('sv').startOf('hour').fromNow()}
        </Text>

        {/* Buttons for handling reservation, coordination and collection */}
        <ProductButtonLogic
          selectedProduct={selectedProduct}
          hasEditPermission={hasEditPermission}
          navigation={props.navigation}
        />

        {isPickedUp ? (
          <>
            <Divider />
            <View style={detailStyles.centered}>
              <HeaderThree
                text={'Används i '}
                style={detailStyles.centeredHeader}
              />

              <HorizontalScroll
                scrollHeight={155}
                roundItem={true}
                detailPath={'ProjectDetail'}
                scrollData={projectForProduct}
                navigation={props.navigation}
              />
            </View>
          </>
        ) : null}
        <SectionCard>
          {/* Info about who created the product post */}
          <ContactDetails
            profileId={ownerId}
            productId={selectedProduct.id}
            hideButton={isPickedUp}
            buttonText={'kontaktdetaljer'}
          />

          {/* Product image */}
          <CachedImage
            style={detailStyles.image}
            uri={selectedProduct.image ? selectedProduct.image : ''}
          />

          {/* Show delete and edit buttons if the user has editing 
        permissions and the product is not yet picked up */}
          {hasEditPermission && !isPickedUp ? (
            <>
              <View style={detailStyles.editOptions}>
                <ButtonIcon
                  icon="pen"
                  color={Colors.neutral}
                  onSelect={() => {
                    editProductHandler(selectedProduct.id);
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
          {hasEditPermission && selectedProduct.internalComments ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>Intern listning:</Paragraph>
              <Paragraph>{selectedProduct.internalComments}</Paragraph>
            </View>
          ) : null}
          {/* General description */}
          <Title>{selectedProduct.title}</Title>

          <Paragraph>{selectedProduct.description}</Paragraph>
          {selectedProduct.length ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>LÄNGD:</Paragraph>
              <Paragraph>{selectedProduct.length}</Paragraph>
            </View>
          ) : null}
          {selectedProduct.height ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>HÖJD:</Paragraph>
              <Paragraph>{selectedProduct.height}</Paragraph>
            </View>
          ) : null}
          {selectedProduct.width ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>BREDD:</Paragraph>
              <Paragraph>{selectedProduct.width}</Paragraph>
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
            {selectedProduct.price ? `${selectedProduct.price} kr` : 'Gratis'}
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
