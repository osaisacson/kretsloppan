import { useNavigation } from '@react-navigation/native';
import React from 'react';
//Components
import { View, Text, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import { Divider, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import ButtonIcon from '../../components/UI/ButtonIcon';
import CachedImage from '../../components/UI/CachedImage';
import ContactDetails from '../../components/UI/ContactDetails';
import EmptyState from '../../components/UI/EmptyState';
import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ProductItem from '../../components/UI/ProductItem';
import SaferArea from '../../components/UI/SaferArea';
import SectionCard from '../../components/UI/SectionCard';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as projectsActions from '../../store/actions/projects';

const ProjectDetailScreen = (props) => {
  const projectId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;

  const loggedInUserId = useSelector((state) => state.auth.userId);

  const selectedProject = useSelector((state) =>
    state.projects.availableProjects.find((proj) => proj.id === projectId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  const associatedProducts = useSelector((state) =>
    state.products.availableProducts.filter((prod) => prod.projectId === projectId)
  );

  const associatedProposals = useSelector((state) =>
    state.proposals.availableProposals.filter((proposal) => proposal.projectId === projectId)
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hasEditPermission = ownerId === loggedInUserId;

  const editProjectHandler = (projectId) => {
    navigation.navigate('EditProject', { detailId: projectId });
  };

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  const deleteHandler = (projectId) => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här projektet? Det går inte att gå ändra sig sen.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(projectsActions.deleteProject(projectId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const projectHeader = selectedProject ? (
    <View>
      <SectionCard>
        <Text style={styles.title}>{selectedProject.title}</Text>
        {selectedProject.location ? (
          <Text style={styles.subTitle}>{selectedProject.location}</Text>
        ) : null}
        <Divider style={{ marginBottom: 8 }} />
        <ContactDetails
          hideButton
          profileId={ownerId}
          projectId={selectedProject.id}
          buttonText="kontaktdetaljer"
        />

        <CachedImage
          style={styles.image}
          uri={selectedProject.image ? selectedProject.image : ''}
        />

        {/* Buttons to show if the user has edit permissions */}
        {hasEditPermission ? (
          <View style={styles.actions}>
            {/* Delete button */}
            <ButtonIcon
              icon="delete"
              color={Colors.warning}
              onSelect={() => {
                deleteHandler(selectedProject.id);
              }}
            />
            <ButtonIcon
              icon="pen"
              color={Colors.neutral}
              onSelect={() => {
                editProjectHandler(selectedProject.id);
              }}
            />
          </View>
        ) : null}
        <Text style={styles.slogan}>{selectedProject.slogan}</Text>
      </SectionCard>
      {selectedProject.description ? (
        <SectionCard>
          <Paragraph style={{ padding: 5 }}>{selectedProject.description}</Paragraph>
        </SectionCard>
      ) : null}

      {associatedProducts.length ? (
        <View style={{ marginVertical: 10 }}>
          {/* Information about the project */}
          <HeaderTwo
            title="Återbruk"
            subTitle="Återbruk som används i projektet"
            indicator={associatedProducts.length ? associatedProducts.length : 0}
          />
        </View>
      ) : (
        <EmptyState style={{ marginVertical: 30 }}>Inget återbruk i projektet ännu</EmptyState>
      )}
    </View>
  ) : null;

  return (
    <SaferArea>
      <ScrollView>
        <FlatList
          initialNumToRender={8}
          horizontal={false}
          numColumns={3}
          data={associatedProducts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={projectHeader}
          renderItem={(itemData) => (
            <ProductItem
              itemData={itemData.item}
              onSelect={() => {
                selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
              }}
            />
          )}
        />
        {associatedProposals.length ? (
          <HorizontalScroll
            textItem
            detailPath="ProposalDetail"
            scrollData={associatedProposals}
            navigation={props.navigation}
          />
        ) : null}
      </ScrollView>
    </SaferArea>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'bebas-neue-book',
    fontSize: 26,
    textAlign: 'center',
    paddingVertical: 8,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 10,
  },
  slogan: {
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default ProjectDetailScreen;
