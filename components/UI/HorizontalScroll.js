import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider, Button } from 'react-native-paper';

import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import HeaderTwo from './HeaderTwo';
import LargeImageItem from './LargeImageItem';
import ProductItem from './ProductItem';
import RoundItem from './RoundItem';
import TextItem from './TextItem';
import TouchableCmp from './TouchableCmp';

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
            buttonText={props.buttonText}
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
                  <TouchableCmp
                    onPress={props.showMoreLink}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: scrollHeight,
                    }}>
                    <Button
                      animated
                      icon="chevron-right"
                      color="#000"
                      contentStyle={{
                        width: 40,
                        paddingLeft: 35,
                        height: scrollHeight,
                      }}
                      onPress={props.showMoreLink}
                    />
                  </TouchableCmp>
                ) : null}
              </ScrollView>
            </View>
          ) : null}
        </View>
        {!props.showMoreLink ? <Divider /> : null}
      </ScrollView>
      {props.showMoreLink ? (
        <>
          <Button
            animated
            mode="contained"
            style={{ marginHorizontal: 10, marginBottom: 20, alignSelf: 'center' }}
            labelStyle={{ fontSize: 10 }}
            color={Colors.darkPrimary}
            onPress={props.showMoreLink}>
            {props.showMoreLinkName}
          </Button>
          <Divider />
        </>
      ) : null}
    </>
  );
};

export default HorizontalScroll;
