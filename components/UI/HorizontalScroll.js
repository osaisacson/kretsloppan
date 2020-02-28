import React from 'react';
//Components
import { ScrollView, View, StyleSheet } from 'react-native';
import ProductItem from '../../components/UI/ProductItem';
import ProjectItem from '../../components/UI/ProjectItem';
import EmptyState from '../../components/UI/EmptyState';
import HeaderTwo from './HeaderTwo';

const HorizontalScroll = props => {
  let RenderedItem = ProductItem; //By default sets the rendered item to be product
  let detailRoute = 'ProductDetail';
  let scrollHeight = 200;

  //Check if we should render the projectItem instead of productItem
  if (props.isProject) {
    RenderedItem = ProjectItem;
    detailRoute = 'ProjectDetail';
    scrollHeight = props.userProject ? 350 : 150;
  }

  const scrollData = props.scrollData;

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate(detailRoute, {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title
    });
  };

  return (
    <ScrollView scrollEventThrottle={16}>
      <HeaderTwo
        title={props.title}
        subTitle={props.subTitle}
        extraSubTitle={props.extraSubTitle}
        icon={props.icon}
        indicator={scrollData.length ? scrollData.length : 0}
        showNotificationBadge={props.showNotificationBadge}
      />
      <View
        style={{
          flex: 1,
          height: scrollHeight
        }}
      >
        {scrollData.length ? (
          <View
            style={{
              height: scrollHeight,
              marginTop: 20
            }}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {scrollData.map(item => (
                <RenderedItem
                  itemData={item}
                  key={item.id}
                  isHorizontal={true}
                  userProject={props.userProject}
                  onSelect={() => {
                    selectItemHandler(item.id, item.ownerId, item.title);
                  }}
                ></RenderedItem>
              ))}
            </ScrollView>
          </View>
        ) : (
          <EmptyState>Inget här ännu</EmptyState>
        )}
      </View>
    </ScrollView>
  );
};

export default HorizontalScroll;
