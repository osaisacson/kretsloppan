import { useNavigation } from '@react-navigation/native';
import moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import { Divider, Title, Paragraph } from 'react-native-paper';
import useGetProduct from '../../../hooks/useGetProduct';
import { useSelector } from 'react-redux';

import { pure } from 'recompose';

import ButtonIcon from '../../../components/UI/ButtonIcon';
import CachedImage from '../../../components/UI/CachedImage';
import FilterLine from '../../../components/UI/FilterLine';
import HeaderTwo from '../../../components/UI/HeaderTwo';
import firebase from 'firebase';

import HeaderThree from '../../../components/UI/HeaderThree';
import Orders from '../../../components/UI/Orders';
import SectionCard from '../../../components/UI/SectionCard';
import StatusBadge from '../../../components/UI/StatusBadge';
import { DetailWrapper, detailStyles } from '../../../components/wrappers/DetailWrapper';
import Colors from '../../../constants/Colors';
import ReservationLogic from './ReservationLogic';

const ProductDetailScreen = (props) => {
  //Get product id from route through props
  const selectedProductId = props.route.params.itemData.id;

  console.log('itemData id passed to productDetailScreen: ', selectedProductId);

  const { status, data, error, isFetching } = useGetProduct(selectedProductId);

  // const getProduct = async (productId) => {
  //   const productRef = await firebase.database().ref(`products/${productId}`).ref.once('value');
  //   console.log('IS THIS SOMETHING: ', productRef);

  //   const productData = { productRef, id: productId };

  //   console.log('PRRRRRODUCTTTTDATAAA: ', productData);

  //   return productRef;
  // };

  // console.log(getProduct(selectedProductId));

  const navigation = useNavigation();

  console.log('itemData in productDetailScreen: ', data);

  if (isFetching) {
    return (
      <DetailWrapper>
        <View>
          <Title>...Laddar</Title>
        </View>
      </DetailWrapper>
    );
  }

  if (error) {
    return (
      <DetailWrapper>
        <View>
          <Title>{data.error}</Title>
        </View>
      </DetailWrapper>
    );
  }

  const {
    id,
    ownerId,
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
  } = data;

  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;
  const profiles = useSelector((state) => state.profiles.allProfiles);
  const sellerProfile = profiles.find((profile) => profile.profileId === ownerId);

  const originalItems = amount === undefined ? 1 : amount;
  const bookedItems = booked || 0;
  const soldItems = sold || 0;

  const productOrders = useSelector((state) =>
    state.orders.availableOrders.filter((order) => order.productId === id)
  );

  const hasAnyOrders = productOrders.length;
  const allSold = hasAnyOrders && originalItems === soldItems;
  const allReserved = hasAnyOrders && originalItems === bookedItems;

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
            //TO DO: Find all orders of the product and delete these as well. Requires some explanatory UI.
          },
        },
      ]
    );
  };

  return (
    <DetailWrapper>
      <View>
        <ReservationLogic
          navigation={navigation}
          hasEditPermission={hasEditPermission}
          selectedProduct={selectedProduct}
        />

        {/* Displays a list of orders for the product if the logged in user is the buyer */}
        {currentUserOrdersOfProduct.length ? (
          <>
            <HeaderTwo
              showNotificationBadge
              title={'Mina reservationer'}
              indicator={currentUserOrdersOfProduct.length}
            />
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
          <View style={[styles.flexAboveItem, { justifyContent: 'space-between' }]}>
            <StatusBadge
              text={
                allReserved
                  ? 'Alla för närvarande reserverade'
                  : allSold
                  ? 'Alla sålda'
                  : `${originalItems - bookedItems} st à`
              }
              style={{
                fontFamily: 'roboto-bold',
                backgroundColor: allSold ? Colors.subtleGreen : Colors.darkPrimary,
                color: '#fff',
              }}
            />
            <StatusBadge
              text={priceText ? priceText : `${price} kr`}
              style={{
                fontFamily: 'roboto-bold',
                backgroundColor: allSold ? Colors.subtleGreen : Colors.darkPrimary,
                color: '#fff',
              }}
            />
          </View>
          {bookedItems && !allReserved && !allSold ? (
            <View style={[styles.flexAboveItem, { marginTop: 40 }]}>
              <StatusBadge
                text={`${bookedItems} reserverade`}
                style={{ fontSize: 15, backgroundColor: Colors.primary, color: '#fff' }}
              />
            </View>
          ) : null}
          {soldItems && !allSold && !allReserved ? (
            <View style={[styles.flexAboveItem, { marginTop: 80 }]}>
              <StatusBadge
                text={`${soldItems} sålda`}
                style={{ fontSize: 15, backgroundColor: Colors.subtlePurple, color: '#fff' }}
              />
            </View>
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
          {originalItems > 1 ? <Paragraph>{originalItems} stycken</Paragraph> : null}
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
          <Paragraph>{sellerProfile.profileName}</Paragraph>
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
          Upplagt {moment(date).locale('sv').startOf('hour').fromNow()}
        </Text>

        <View style={{ marginTop: 20 }}>
          {/* Displays a list of orders for the product if the logged in user is the seller */}
          {hasEditPermission && productOrders.length ? (
            <>
              <HeaderTwo
                showNotificationBadge
                title={'Reservationer'}
                indicator={productOrders.length}
              />
              <Orders
                isProductDetail
                loggedInUserId={loggedInUserId}
                orders={productOrders}
                navigation={navigation}
              />
              <Divider
                style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }}
              />
            </>
          ) : null}
        </View>
      </View>
    </DetailWrapper>
  );
};

const styles = StyleSheet.create({
  flexAboveItem: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    zIndex: 10,
    width: '100%',
  },
});

export const screenOptions = () => {
  return {
    headerTitle: '',
  };
};

export default pure(ProductDetailScreen);
