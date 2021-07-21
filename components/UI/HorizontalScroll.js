import React from 'react';
import { ScrollView, View } from 'react-native';
import { Divider } from 'react-native-paper';

import Colors from './../../constants/Colors';
import Styles from './../../constants/Styles';
import ButtonSeeMore from './ButtonSeeMore';
import HeaderTwo from './HeaderTwo';
import LargeImageItem from './LargeImageItem';
import ProductItem from './ProductItem';
import ProposalItem from './ProposalItem';

const HorizontalScroll = (props) => {
  //By default sets the rendered item to be ProductItem
  let RenderedItem = ProductItem;
  let scrollHeight = props.scrollHeight ? props.scrollHeight : Styles.largeProductItemHeight;
  const detailPath = props.detailPath ? props.detailPath : 'ProductDetail';

  //Check if we instead should render the ProposalItem
  if (props.isProposal) {
    RenderedItem = ProposalItem;
    scrollHeight = props.scrollHeight ? props.scrollHeight : Styles.textItemHeight;
  }

  //Check if we instead should render the LargeImageItem
  if (props.isProject) {
    RenderedItem = LargeImageItem;
    scrollHeight = Styles.largeImageItemHeight;
  }

  const scrollData = props.scrollData;

  if (!scrollData.length) {
    scrollHeight = 0;
  }

  const selectItemHandler = (itemData) => {
    console.log('SELECTED PRODUCT FROM HORIZONTAL SCROLL', itemData);
    props.navigation.navigate(detailPath, {
      itemData: itemData,
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
            buttonOnPress={props.buttonOnPress}
            showAddLink={props.showAddLink}
            showMoreLink={props.showMoreLink}
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
                    itemData={item}
                    key={item.id}
                    isHorizontal
                    onSelect={() => {
                      selectItemHandler(item);
                    }}
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
        <Divider style={{ marginBottom: 20, borderColor: Colors.primary, borderWidth: 0.6 }} />
      </ScrollView>
    </>
  );
};

export default HorizontalScroll;
