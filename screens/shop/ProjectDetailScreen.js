import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  FlatList
} from 'react-native';
import HeaderTwo from '../../components/UI/HeaderTwo';
import UsedItem from '../../components/UI/UsedItem';
import ButtonIcon from '../../components/UI/ButtonIcon';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as projectsActions from '../../store/actions/projects';

const ProjectDetailScreen = props => {
  const projectId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;

  const loggedInUserId = useSelector(state => state.auth.userId);

  const selectedProject = useSelector(state =>
    state.projects.availableProjects.find(proj => proj.id === projectId)
  ); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  const associatedProducts = useSelector(state =>
    state.products.availableProducts.filter(
      prod => prod.projectId === projectId
    )
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hasEditPermission = ownerId === loggedInUserId;

  const editProjectHandler = id => {
    navigation.navigate('EditProject', { detailId: id });
  };

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title
    });
  };

  const deleteHandler = () => {
    const id = selectedProject.id;
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här projektet? Det går inte att gå ändra sig sen.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(projectsActions.deleteProject(id));
          }
        }
      ]
    );
  };

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProject.image }} />

      {/* Buttons to show if the user has edit permissions */}
      {hasEditPermission ? (
        <View style={styles.actions}>
          {/* Delete button */}
          <ButtonIcon
            icon="delete"
            color={Colors.warning}
            onSelect={deleteHandler.bind(this)}
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

      {/* Information about the project */}
      <Text style={styles.description}>{selectedProject.slogan}</Text>
      <HeaderTwo
        title={'Återbruk'}
        subTitle={'Återbruk som är använt/kommer användas i projektet'}
        indicator={associatedProducts.length ? associatedProducts.length : 0}
      />
      <FlatList
        horizontal={false}
        numColumns={3}
        data={associatedProducts}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <UsedItem
            key={itemData.item.id}
            isHorizontal={true}
            image={itemData.item.image}
            title={itemData.item.title}
            status={itemData.item.status ? itemData.item.status : 'redo'}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title
              );
            }}
          />
        )}
      />
    </ScrollView>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.detailTitle
  };
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%'
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center'
  },
  toggles: {
    flex: 1,
    marginBottom: 10,
    alignItems: 'center'
  },
  price: {
    fontFamily: 'roboto-regular',
    fontSize: 20,
    textAlign: 'right',
    marginHorizontal: 20
  },
  description: {
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProjectDetailScreen;
