import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SaferArea from '../UI/SaferArea';
import Colors from '../../constants/Colors';

export const DetailWrapper = props => {
  return (
    <SaferArea>
      <ScrollView>
        <View style={detailStyles.mainDetailWrap}>{props.children}</View>
      </ScrollView>
    </SaferArea>
  );
};

export const detailStyles = StyleSheet.create({
  mainDetailWrap: {
    flex: 1,
    marginBottom: 50,
    marginHorizontal: 8
  },
  centeredContent: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 300,
    width: '100%'
  },
  price: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centeredHeader: {
    textAlign: 'center',
    fontFamily: 'roboto-bold'
  },
  sectionHeader: {
    marginLeft: 5,
    fontFamily: 'bebas-neue-bold',
    fontSize: 18,
    paddingTop: 30
  },
  textCard: {
    padding: 10,
    borderWidth: 0.3,
    borderRadius: 4,
    borderColor: '#666'
  },
  boundaryText: {
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'roboto-light'
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center'
  },
  formControl: {
    width: '100%'
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  label: {
    fontFamily: 'roboto-bold',
    marginVertical: 8
  },
  subLabel: {
    fontFamily: 'roboto-light-italic'
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'roboto-regular',
    color: 'grey',
    fontSize: 13,
    textAlign: 'right'
  },
  emptyState: {
    padding: 20,
    color: '#c0c0c0'
  }
});
