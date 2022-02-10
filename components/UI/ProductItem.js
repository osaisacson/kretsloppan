import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pure } from 'recompose';

import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import CardTouchable from './CardTouchable';
import CardBottomInfo from './CardBottomInfo';

const ProductItem = ({ itemData, onSelect, cardHeight, hideInfo }) => {
  const { image, priceText, price, background, amount, sold, booked, title } = itemData;

  const originalItems = amount === undefined ? 1 : amount;
  const bookedItems = booked || 0;
  const soldItems = sold || 0;

  const allSold = originalItems === soldItems;
  const allReserved = originalItems === bookedItems;

  // Overlay badge showing either the number of items left or copy saying all is reserved or sold
  const overlayBadgeComponent = (
    <View style={styles.overlayBadge}>
      <Text
        style={{
          ...styles.status,
          backgroundColor: allSold ? Colors.subtleGreen : allReserved ? Colors.darkPrimary : '#fff',
          color: allSold || allReserved ? '#fff' : '#000',
        }}>
        {allSold || allReserved
          ? allSold
            ? 'Alla sålda'
            : 'Alla reserverade'
          : `${originalItems - bookedItems} st kvar`}
      </Text>
    </View>
  );

  // Info below the image: title, background, price, priceText
  const underCardInfoComponent = !hideInfo ? (
    <>
      <CardBottomInfo title={title} description={background} />

      {(price || price === 0) && !priceText ? (
        <Text style={styles.price}>
          {`${price ? price : 0} kr `}
          {originalItems > 1 ? 'styck' : null}
        </Text>
      ) : null}

      {price && priceText ? (
        <Text style={styles.price}>{`${price}kr eller ${priceText}`}</Text>
      ) : null}

      {priceText && !price ? <Text style={styles.price}>{priceText}</Text> : null}
    </>
  ) : null;

  return (
    <CardTouchable
      image={image}
      cardHeight={cardHeight}
      onSelect={onSelect}
      overlayBadge={overlayBadgeComponent}
      underCardInfo={underCardInfoComponent}
    />
  );
};

const styles = StyleSheet.create({
  price: {
    marginTop: 8,
    fontFamily: 'roboto-bold',
  },
  overlayBadge: {
    position: 'absolute',
    borderRadius: Styles.borderRadius,
    zIndex: 100,
  },
  status: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 14,
  },
});

export default pure(ProductItem);
