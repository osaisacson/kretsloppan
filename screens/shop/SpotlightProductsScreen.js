import React from 'react';

import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/wrappers/SaferArea';

import SpotlightProducts from './SpotlightProducts';
import SpotlightProjects from './SpotlightProjects';
import SpotlightProposals from './SpotlightProposals';

const SpotlightProductsScreen = (props) => {
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});

  const ListHeaderComponent = (
    <>
      {!currentProfile.hasReadNews ? (
        <Introduction
          currUserId={currentProfile.id}
          hasReadNews={currentProfile.hasReadNews}
          pic="https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1663&q=80"
          text="NYHETER: Ny version av Kretsloppan släppt, hurra! För feedback kontakta asaisacson@gmail.com, vi gör kontinuerliga uppdateringar. Version: 1.0.9"
        />
      ) : null}
    </>
  );

  const ListFooterComponent = (
    <>
      {/* Products */}
      <SpotlightProducts />

      {/* Projects */}
      <SpotlightProjects />

      {/* Proposals */}
      <SpotlightProposals />
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

export default SpotlightProductsScreen;
