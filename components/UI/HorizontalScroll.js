import React from 'react';
//Components
import { Divider } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import ProductItem from '../../components/UI/ProductItem';
import RoundItem from '../../components/UI/RoundItem';
import LargeItem from '../../components/UI/LargeItem';
import TextItem from '../../components/UI/TextItem';
import EmptyState from '../../components/UI/EmptyState';
import HeaderTwo from './HeaderTwo';

const HorizontalScroll = (props) => {
  //By default sets the rendered item to be product
  let RenderedItem = ProductItem;
  let scrollHeight = 250;
  let detailPath = props.detailPath ? props.detailPath : 'ProductDetail';

  //Check if we instead should render the roundItem
  if (props.roundItem) {
    RenderedItem = RoundItem;
    scrollHeight = 180;
  }

  //Check if we instead should render the textitem
  if (props.textItem) {
    RenderedItem = TextItem;
    scrollHeight = 210;
  }

  //Check if we instead should render the largeItem
  if (props.largeItem) {
    RenderedItem = LargeItem;
    scrollHeight = 350;
  }

  const scrollData = props.scrollData;

  if (!scrollData.length) {
    scrollHeight = 100;
  }

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate(detailPath, {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title,
    });
  };

  return (
    <>
      <Divider />
      <ScrollView
        scrollEventThrottle={16}
        style={{
          backgroundColor: props.bgColor ? props.bgColor : 'transparent',
        }}
      >
        {props.title ? (
          <HeaderTwo
            title={props.title}
            subTitle={props.subTitle}
            extraSubTitle={props.extraSubTitle}
            buttonOnPress={props.buttonOnPress}
            questionText={props.questionText}
            icon={props.icon}
            indicator={scrollData.length ? scrollData.length : 0}
            showNotificationBadge={props.showNotificationBadge}
          />
        ) : null}
        <View
          style={{
            flex: 1,
            height: scrollHeight,
          }}
        >
          {/* If dataset passed is not empty  */}
          {scrollData.length ? (
            <View
              style={{
                height: scrollHeight,
                marginTop: 20,
              }}
            >
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {scrollData.map((item) => (
                  <RenderedItem
                    itemData={item}
                    key={item.id}
                    isHorizontal={true}
                    onSelect={
                      props.customHandler
                        ? props.customHandler
                        : () => {
                            selectItemHandler(
                              item.id,
                              item.ownerId,
                              item.title
                            );
                          }
                    }
                  ></RenderedItem>
                ))}
              </ScrollView>
            </View>
          ) : (
            <EmptyState>Inget här ännu</EmptyState>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default HorizontalScroll;
