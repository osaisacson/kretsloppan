import React from 'react';

import { FlatList, Text } from 'react-native';

import Card from '../components/UI/Card';
import SaferArea from '../components/wrappers/SaferArea';

import SpotlightProducts from './SpotlightProducts';
import SpotlightProjects from './SpotlightProjects';
import SpotlightProposals from './SpotlightProposals';
import { Divider } from 'react-native-paper';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';

const SpotlightScreen = () => {
  const ListHeaderComponent = (
    <Card style={{ padding: 10, margin: 8, backgroundColor: Colors.extraDarkPrimary }}>
      <Text style={{ ...Styles.contentHeader, color: '#fff', textAlign: 'center' }}>
        Välkommen till Kretsloppan!
      </Text>
      <Text style={{ fontFamily: 'roboto-bold-italic', textAlign: 'center', color: '#fff' }}>
        Hitta återbruk i din trakt, lägg upp projekt du bygger och efterlys material du behöver.
      </Text>
    </Card>
  );

  const ListFooterComponent = (
    <>
      {/* Projects */}
      <SpotlightProjects />

      <Divider style={{ marginTop: 25, marginBottom: 20 }} />

      {/* Products */}
      <SpotlightProducts
        nrItemsToShow={9}
        rowsToShow={3}
        showButtonSeeMore
        showAddNew
        title={'Återbruk'}
      />

      <Divider style={{ marginTop: 25, marginBottom: 20 }} />

      {/* Proposals */}
      <SpotlightProposals nrItemsToShow={4} showButtonSeeMore showAddNew title={'Efterlysningar'} />

      <Divider style={{ marginTop: 35, marginBottom: 0 }} />
    </>
  );

  return (
    <SaferArea>
      <FlatList
        listKey="spotlightFlatlist"
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </SaferArea>
  );
};

export default SpotlightScreen;
