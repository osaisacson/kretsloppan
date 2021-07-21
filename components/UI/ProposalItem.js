import React from 'react';
import { View } from 'react-native';
import { Divider } from 'react-native-paper';
import { pure } from 'recompose';

import CardTemplate from '../UI/CardTemplate';
import CardBottomInfo from '../UI/CardBottomInfo';
import ProductAvatarAndLocation from '../UI/ProductAvatarAndLocation';

const ProposalItem = ({ itemData, onSelect, navigation }) => {
  const { title, description } = itemData;

  return (
    <CardTemplate onSelect={onSelect}>
      <View style={{ padding: 10 }}>
        <ProductAvatarAndLocation navigation={navigation} itemData={itemData} />
        <Divider style={{ marginVertical: 10 }} />
        <CardBottomInfo title={title} description={description} />
      </View>
    </CardTemplate>
  );
};

export default pure(ProposalItem);
