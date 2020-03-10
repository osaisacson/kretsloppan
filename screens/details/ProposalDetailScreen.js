import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Text, Alert } from 'react-native';
import {
  DetailWrapper,
  detailStyles
} from '../../components/wrappers/DetailWrapper';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
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
  const projectForProposal = selectedProposal.projectId
    ? userProjects.filter(proj => proj.id === selectedProposal.projectId)
    : {};

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
    <DetailWrapper>
      {/* Information about the proposal */}
      <View
        style={{
          ...detailStyles.textCard,
          backgroundColor: Colors.primary
        }}
      >
        <Text
          style={{
            ...detailStyles.boundaryText,
            textAlign: 'center',
            color: '#fff'
          }}
        >
          {selectedProposal.title}
        </Text>
      </View>
      <Text style={detailStyles.price}>
        {selectedProposal.price
          ? `${selectedProposal.price} kr`
          : 'Voluntär/Donation'}
      </Text>
      <Text style={detailStyles.sectionHeader}>Beskrivning</Text>
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          {selectedProposal.description}
        </Text>
      </View>

      {/* Buttons to show if the user has edit permissions and the item is not yet picked up */}
      {hasEditPermission && !isResolved ? (
        <View style={detailStyles.actions}>
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
      <View style={detailStyles.toggles}>
        <ButtonNormal
          color={Colors.primary}
          disabled={isResolved} //disable/enable base on true/false of these params
          actionOnPress={isResolvedHandler}
          text={isResolved ? 'löst' : 'markera som löst'}
        />

        {/* If proposal has a project id, show the project it belongs to */}
        {projectForProposal.length > 0 ? (
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
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = navData => {
  return {
    headerTitle: navData.route.params.detailTitle
  };
};

export default ProposalDetailScreen;
