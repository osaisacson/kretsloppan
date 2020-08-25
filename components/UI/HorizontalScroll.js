import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Button } from 'react-native-paper';

import Styles from './../../constants/Styles';
import HeaderTwo from './HeaderTwo';
import LargeImageItem from './LargeImageItem';
import ProductItem from './ProductItem';
import RoundItem from './RoundItem';
import TextItem from './TextItem';
import ButtonSeeMore from './ButtonSeeMore';

const HorizontalScroll = (props) => {
  //By default sets the rendered item to be ProductItem
  let RenderedItem = ProductItem;
  let scrollHeight = props.scrollHeight ? props.scrollHeight : Styles.productItemHeight;
  const detailPath = props.detailPath ? props.detailPath : 'ProductDetail';

  //Check if we instead should render the RoundItem
  if (props.roundItem) {
    RenderedItem = RoundItem;
    scrollHeight = props.scrollHeight ? props.scrollHeight : Styles.roundItemHeight;
  }

  //Check if we instead should render the TextItem
  if (props.textItem) {
    RenderedItem = TextItem;
    scrollHeight = props.scrollHeight ? props.scrollHeight : Styles.textItemHeight;
  }

  //Check if we instead should render the LargeImageItem
  if (props.largeImageItem) {
    RenderedItem = LargeImageItem;
    scrollHeight = Styles.largeImageItemHeight;
  }

  const scrollData = props.scrollData;

  if (!scrollData.length) {
    scrollHeight = 0;
  }

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate(detailPath, {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  const scrollHeightAndMargins = scrollHeight > 0 ? scrollHeight + 70 : 0;

  return (
    <>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        style={{
          backgroundColor: props.bgColor ? props.bgColor : 'transparent',
        }}>
        {props.title ? (
          <HeaderTwo
            title={props.title}
            subTitle={props.subTitle}
            extraSubTitle={props.extraSubTitle}
            buttonOnPress={props.buttonOnPress}
            showAddLink={props.showAddLink}
            showMoreLink={props.showMoreLink}
            showMoreNr={props.showMoreNr}
            icon={props.icon}
            simpleCount={props.simpleCount}
            indicator={scrollData.length ? scrollData.length : 0}
            showNotificationBadge={props.showNotificationBadge}
          />
        ) : null}
        <View
          style={{
            flex: 1,
            height: scrollHeightAndMargins,
          }}>
          {/* If dataset passed is not empty  */}
          {scrollData.length ? (
            <View
              style={{
                height: scrollHeightAndMargins,
                marginTop: 20,
              }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {scrollData.map((item) => (
                  <RenderedItem
                    navigation={props.navigation}
                    showBackgroundText={props.showBackgroundText}
                    itemData={item}
                    key={item.id}
                    isHorizontal
                    onSelect={
                      props.customHandler
                        ? props.customHandler
                        : () => {
                            selectItemHandler(item.id, item.ownerId, item.title);
                          }
                    }
                  />
                ))}
                {props.showMoreLink && scrollData.length > 1 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 20,
                      paddingRight: 30,
                      height: scrollHeight,
                    }}>
                    <ButtonSeeMore itemNr={scrollData.length} onSelect={props.showMoreLink} />
                  </View>
                ) : null}
              </ScrollView>
            </View>
          ) : null}
        </View>
        {!props.showMoreLink ? <Divider /> : null}
      </ScrollView>
    </>
  );
};

export default HorizontalScroll;
