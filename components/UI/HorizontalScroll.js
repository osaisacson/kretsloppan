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
  if (props.isProject) {
    RenderedItem = ProjectItem;
    detailRoute = 'ProjectDetail';
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
        indicator={scrollData.length ? scrollData.length : 0}
        showNotificationBadge={props.showNotificationBadge}
      />
      <View
        style={{
          flex: 1,
          height: props.isProject ? 130 : 200
        }}
      >
        {scrollData.length ? (
          <View
            style={{
              height: props.isProject ? 130 : 200,
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
