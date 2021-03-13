import { useNavigation } from '@react-navigation/native';
import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Alert, Text } from 'react-native';
import { Divider, Title, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import ButtonIcon from '../../../components/UI/ButtonIcon';
import CachedImage from '../../../components/UI/CachedImage';
import FilterLine from '../../../components/UI/FilterLine';
import HeaderThree from '../../../components/UI/HeaderThree';
import Orders from '../../../components/UI/Orders';
import SectionCard from '../../../components/UI/SectionCard';
import StatusBadge from '../../../components/UI/StatusBadge';
import { DetailWrapper, detailStyles } from '../../../components/wrappers/DetailWrapper';
import Colors from '../../../constants/Colors';
import * as productsActions from '../../../store/actions/products';
import Logistics from './Logistics';

const ProductDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const productId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;
  const profiles = useSelector((state) => state.profiles.allProfiles);
  const ownerProfile = profiles.find((profile) => profile.profileId === ownerId);

  //Find us the product that matches the current productId
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  if (!selectedProduct) {
    return null;
  }

  const {
    id,
    amount,
    category,
    color,
    condition,
    date,
    description,
    background,
    height,
    image,
    internalComments,
    length,
    material,
    price,
    priceText,
    phone,
    address,
    pickupDetails,
    style,
    title,
    width,
    location,
    booked,
    sold,
  } = selectedProduct;

  const productOrders = useSelector((state) =>
    state.orders.availableOrders.filter((order) => order.productId === id)
  );

  console.log('productOrders: ', productOrders);

  const allOrdersCollected = productOrders.every((order) => order.isCollected);
  const allSold = amount === sold && allOrdersCollected;
  const allReserved = amount > sold && !allOrdersCollected;

  //Check if the current user has any orders for the product
  const userOrders = useSelector((state) => state.orders.userOrders);
  const currentUserOrdersOfProduct = userOrders.filter(
    (order) => order.productId === id && order.buyerId === loggedInUserId
  );

  //Check status of product and privileges of user
  const hasEditPermission = ownerId === loggedInUserId;

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
        <Logistics
          navigation={navigation}
          hasEditPermission={hasEditPermission}
          selectedProduct={selectedProduct}
        />
        {/* Displays a list of orders for the product if the logged in user is the seller */}
        {hasEditPermission && productOrders.length ? (
          <>
            <Orders
              isProductDetail
              loggedInUserId={loggedInUserId}
              orders={productOrders}
              navigation={navigation}
            />
            <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
          </>
        ) : null}

        {/* Displays a list of orders for the product if the logged in user is the seller */}
        {currentUserOrdersOfProduct.length ? (
          <>
            <Orders
              isProductDetail
              loggedInUserId={loggedInUserId}
              orders={currentUserOrdersOfProduct}
              navigation={navigation}
            />
            <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
          </>
        ) : null}

        <SectionCard>
          {!allSold && !allReserved ? (
            <>
              {/* {amount ? <Text style={detailStyles.amount}>{amount} st à</Text> : null} */}
              {priceText && !price ? <Text style={detailStyles.price}>{priceText}</Text> : null}
              {(price || price === 0) && !priceText ? (
                <Text style={detailStyles.price}>{price ? price : 0} kr</Text>
              ) : null}
            </>
          ) : null}

          <StatusBadge
            style={{
              position: 'absolute',
              zIndex: 10,
              top: -5,
              left: -3,
              alignSelf: 'left',
              width: 200,
            }}
            text={
              amount === booked //if original amount is the same as booked
                ? 'Alla för närvarande reserverade' //then all are reserved
                : amount === sold //if original amount is the same as sold
                ? amount > 1
                  ? 'Alla sålda'
                  : 'Såld' //then all are sold
                : amount > booked
                ? `${amount - booked} kvar`
                : `${amount} st à` //if original amount is more than booked, show how many are left
            }
            backgroundColor={Colors.darkPrimary}
          />
          {allSold ? (
            <StatusBadge
              style={{
                position: 'absolute',
                zIndex: 10,
                top: -5,
                left: -3,
                alignSelf: 'left',
                width: 80,
              }}
              text={amount === 1 ? 'Såld!' : 'Alla sålda!'}
              backgroundColor={Colors.subtleGreen}
            />
          ) : null}
          {/* Product image */}
          <CachedImage style={detailStyles.image} uri={image ? image : ''} />

          {/* Show delete and edit buttons if the user has editing 
        permissions and the product is not yet picked up */}
          {hasEditPermission ? (
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
          {location ? (
            <>
              <Divider style={{ marginVertical: 5 }} />
              <Paragraph>{location}</Paragraph>
            </>
          ) : null}
          <Title>{title}</Title>
          {amount > 1 ? <Paragraph>{amount} stycken</Paragraph> : null}
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
          <HeaderThree style={{ marginVertical: 10 }} text="Upphämtningsdetaljer" />
          <Paragraph>{ownerProfile.profileName}</Paragraph>
          <Paragraph>{phone ? phone : 'Ingen telefon angiven'}</Paragraph>
          <Paragraph>{address ? address : 'Ingen address angiven'}</Paragraph>
          <Paragraph>{pickupDetails}</Paragraph>
          <Divider style={{ marginTop: 10 }} />

          {/* Only show filter badges if we have any filters */}
          {category || condition || style || material || color ? (
            <>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {category === 'Ingen' ? null : <FilterLine filter={category} />}
                {condition === 'Inget' ? null : <FilterLine filter={condition} />}
                {style === 'Ingen' ? null : <FilterLine filter={style} />}
                {material === 'Inget' ? null : <FilterLine filter={`${material} material`} />}
                {color === 'Ingen' ? null : <FilterLine filter={color} />}
              </View>
              <Divider style={{ marginBottom: 10 }} />
            </>
          ) : null}
        </SectionCard>
        <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
          Upplagt {Moment(date).locale('sv').startOf('hour').fromNow()}
        </Text>
      </View>
    </DetailWrapper>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProductDetailScreen;
