import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/wrappers/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import ProductItem from '../../components/UI/ProductItem';

import Styles from './../../constants/Styles';

const SpotlightProductsScreen = (props) => {
  const allProductsRaw = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector((state) => state.proposals.availableProposals);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});

  const allProducts = allProductsRaw.filter((product) => !(product.amount === product.sold));

  const recentProductsSorted = allProducts.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProjectsSorted = allProjects.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentActiveProposals = allProposals.filter((proposal) => proposal.status !== 'löst');

  const recentProposalsSorted = recentActiveProposals.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  const recentProducts = recentProductsSorted.slice(0, 6);
  const recentProjects = recentProjectsSorted.slice(0, 5);
  const recentProposals = recentProposalsSorted.slice(0, 5);

  return (
    <SaferArea>
      {!currentProfile.hasReadNews ? (
        <Introduction
          currUserId={currentProfile.id}
          hasReadNews={currentProfile.hasReadNews}
          pic="https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1663&q=80"
          text="NYHETER: Ny version av Kretsloppan släppt, hurra! För feedback kontakta asaisacson@gmail.com, vi gör kontinuerliga uppdateringar. Version: 1.0.8"
        />
      ) : null}
      <FlatList
        numColumns={3}
        data={recentProducts}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <>
            <View style={styles.container}>
              <ProductItem
                hideInfo
                productHeight={Styles.smallProductItemHeight}
                itemData={itemData.item}
                onSelect={() => {
                  selectItemHandler(itemData.item);
                }}
              />
            </View>
          </>
        )}
        ListHeaderComponent={
          <HeaderTwo
            title={'Återbruk'}
            buttonOnPress={props.buttonOnPress}
            showAddLink={() => props.navigation.navigate('EditProduct')}
            showMoreLink={
              allProducts.length > 1 ? () => props.navigation.navigate('Återbruk') : false
            }
            icon={
              <FontAwesome5
                name="recycle"
                size={21}
                style={{
                  marginRight: 5,
                }}
              />
            }
            indicator={allProducts.length ? allProducts.length : 0}
          />
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <HorizontalScroll
          isProject
          detailPath="ProjectDetail"
          title="Projekt"
          showAddLink={() => props.navigation.navigate('EditProject')}
          showMoreLink={allProjects.length > 1 ? () => props.navigation.navigate('Projekt') : false}
          scrollData={recentProjects}
          navigation={props.navigation}
          icon={
            <Entypo
              name="tools"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
        <HorizontalScroll
          isProposal
          scrollHeight={55}
          detailPath="ProposalDetail"
          title="Efterlysningar"
          showAddLink={() => props.navigation.navigate('EditProposal')}
          showMoreLink={
            allProposals.length > 1 ? () => props.navigation.navigate('Efterlysningar') : false
          }
          scrollData={recentProposals}
          navigation={props.navigation}
          icon={
            <MaterialCommunityIcons
              name="alert-decagram-outline"
              size={24}
              style={{
                marginRight: 3,
                marginBottom: 2,
              }}
            />
          }
        />
      </ScrollView>
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 8,
  },
});

export default SpotlightProductsScreen;
