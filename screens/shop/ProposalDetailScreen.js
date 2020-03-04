import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { ScrollView, View, Text, Image, StyleSheet, Alert } from 'react-native';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import SaferArea from '../../components/UI/SaferArea';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ButtonToggle from '../../components/UI/ButtonToggle';
import ButtonNormal from '../../components/UI/ButtonNormal';

//Constants
import Colors from '../../constants/Colors';
//Actions
import * as proposalsActions from '../../store/actions/proposals';

const ProposalDetailScreen = props => {
  const [isToggled, setIsToggled] = useState(false);
  const proposalId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;

  const loggedInUserId = useSelector(state => state.auth.userId);
  //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above
  const selectedProposal = useSelector(state =>
    state.proposals.availableProposals.find(prod => prod.id === proposalId)
  );
  //Projects
  const userProjects = useSelector(state => state.projects.userProjects);
  const projectForProposal = userProjects.filter(
    proj => proj.id === selectedProposal.projectId
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hasEditPermission = ownerId === loggedInUserId;

  const editProposalHandler = id => {
    navigation.navigate('EditProposal', { detailId: id });
  };

  //TODO change the status flags to match efterlysningar
  const isActive = selectedProposal.status === 'aktiv';
  const isResolved = selectedProposal.status === 'löst';

  const deleteHandler = () => {
    const id = selectedProposal.id;
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här efterlysningen? Det går inte att gå ändra sig sen.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(proposalsActions.deleteProposal(id));
          }
        }
      ]
    );
  };

  const collectHandler = () => {
    const id = selectedProposal.id;
    Alert.alert(
      'Är efterlysningen löst?',
      'Genom att klicka här bekräftar du att efterlysningen är löst. Den kommer då försvinna från det aktiva förrådet och hamna i ditt Gett Igen förråd.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, flytta den',
          style: 'destructive',
          onPress: () => {
            dispatch(proposalsActions.changeProposalStatus(id, 'löst'));
          }
        }
      ]
    );
  };

  const toggleIsActiveHandle = () => {
    const id = selectedProposal.id;
    setIsToggled(prevState => !prevState);
    let status = selectedProposal.status === 'pausad' ? 'aktiv' : 'pausad';
    dispatch(proposalsActions.changeProposalStatus(id, status));
    props.navigation.goBack();
  };

  const isResolvedHandler = () => {
    Alert.alert(
      `Sätt som 'löst'`,
      'Detta kommer avaktivera din efterlysning.',
      [
        { text: 'Cancel', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(proposalsActions.changeProposalStatus(id, 'löst'));
            navigation.navigate('ProposalsOverview');
          }
        }
      ]
    );
  };

  return (
    <SaferArea>
      <ScrollView>
        {/* Buttons to show if the user has edit permissions and the item is not yet picked up */}
        {hasEditPermission && !isResolved ? (
          <View style={styles.actions}>
            {/* Delete button */}
            <ButtonIcon
              icon="delete"
              color={Colors.warning}
              onSelect={deleteHandler.bind(this)}
            />
            {
              <ButtonToggle
                isToggled={isToggled}
                icon={isActive ? 'notification' : 'pause'}
                title={`byt till ${isActive ? 'pausad' : 'aktiv'}`}
                onSelect={toggleIsActiveHandle.bind(this)}
              />
            }
            <ButtonIcon
              icon="pen"
              color={Colors.neutral}
              onSelect={() => {
                editProposalHandler(selectedProposal.id);
              }}
            />
          </View>
        ) : null}

        {/* Buttons to always show, but to have conditional type based on   */}
        <View style={styles.toggles}>
          <ButtonNormal
            color={Colors.primary}
            disabled={isResolved} //disable/enable base on true/false of these params
            actionOnPress={isResolvedHandler}
          >
            {isResolved ? 'löst' : 'markera som löst'}
          </ButtonNormal>

          {/* If proposal has a project id, show the project it belongs to */}
          {selectedProposal.projectId ? (
            <>
              <Text>För projekt:</Text>
              <HorizontalScroll
                roundItem={true}
                detailPath={'ProjectDetail'}
                scrollData={projectForProposal}
                navigation={props.navigation}
              />
            </>
          ) : null}
        </View>

        {/* Information about the proposal */}
        <Text style={styles.price}>
          {selectedProposal.price
            ? `${selectedProposal.price} kr`
            : 'Voluntär/Donation'}
        </Text>
        <Text style={styles.description}>{selectedProposal.description}</Text>
      </ScrollView>
    </SaferArea>
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
    fontFamily: 'roboto-regular',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProposalDetailScreen;
