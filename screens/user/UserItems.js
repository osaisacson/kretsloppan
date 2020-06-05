import React from 'react';

import HorizontalScroll from '../../components/UI/HorizontalScroll';

const UserItems = (props) => {
  const { userProjects, userProposals, userUploads, navigation } = props;

  return (
    <>
      {/* Product, project and proposal sections */}
      <HorizontalScroll
        largeImageItem
        detailPath="ProjectDetail"
        title="Mina projekt"
        subTitle="Projekt jag bygger med återbruk"
        scrollData={userProjects}
        navigation={navigation}
      />
      <HorizontalScroll
        title="Mitt tillgängliga återbruk"
        isNavigationButton
        buttonOnPress={() => navigation.navigate('Mitt upplagda återbruk')}
        scrollData={userUploads}
        navigation={navigation}
      />
      <HorizontalScroll
        textItem
        detailPath="ProposalDetail"
        title="Mina Efterlysningar"
        subTitle="Mina upplagda efterlysningar"
        scrollData={userProposals}
        navigation={navigation}
      />
    </>
  );
};

export default UserItems;
