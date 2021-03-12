import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Proposal from '../../models/proposal';

export const DELETE_PROPOSAL = 'DELETE_PROPOSAL';
export const CREATE_PROPOSAL = 'CREATE_PROPOSAL';
export const UPDATE_PROPOSAL = 'UPDATE_PROPOSAL';
export const SET_PROPOSALS = 'SET_PROPOSALS';
export const CHANGE_PROPOSAL_STATUS = 'CHANGE_PROPOSAL_STATUS';

export function fetchProposals() {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log('Fetching proposals...');
      const proposalSnapshot = await firebase.database().ref('proposals').once('value');

      if (proposalSnapshot.exists) {
        const normalizedProposalData = proposalSnapshot.val();
        const allProposals = [];
        const userProposals = [];

        for (const key in normalizedProposalData) {
          const proposal = normalizedProposalData[key];
          const newProposal = new Proposal(
            key,
            proposal.ownerId,
            proposal.projectId,
            proposal.title,
            proposal.description,
            proposal.price,
            proposal.date,
            proposal.status
          );

          allProposals.push(newProposal);

          if (proposal.ownerId === uid) {
            userProposals.push(newProposal);
          }
        }

        dispatch({
          type: SET_PROPOSALS,
          proposals: allProposals,
          userProposals,
        });
        console.log(`Proposals:`);
        console.log(`...${allProposals.length} total proposals found and loaded.`);
        console.log(`...${userProposals.length} proposals created by the user found and loaded.`);
      }
    } catch (error) {
      console.log('Error in actions/proposals/fetchProposals: ', error);
      throw error;
    }
  };
}

export const deleteProposal = (proposalId) => {
  return async (dispatch) => {
    try {
      console.log(`Attempting to delete proposal with id: ${proposalId}...`);
      await firebase.database().ref(`proposals/${proposalId}`).remove();

      dispatch({ type: DELETE_PROPOSAL, pid: proposalId });
      console.log(`...proposal deleted!`);
    } catch (error) {
      console.log('Error in actions/proposals/deleteProposal: ', error);
      throw new Error(error.message);
    }
  };
};

export function createProposal(title, description, price, projectId) {
  return async (dispatch, getState) => {
    const currentDate = new Date().toISOString();
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const ownerId = userData.userId;

    try {
      console.log('Attempting to create new proposal...');

      const proposalData = {
        ownerId,
        projectId,
        title,
        description,
        price,
        date: currentDate,
      };

      const { key } = await firebase.database().ref('proposals').push(proposalData);

      dispatch({
        type: CREATE_PROPOSAL,
        proposalData: {
          id: key,
          ownerId,
          projectId,
          title,
          description,
          price,
          date: currentDate,
        },
      });

      console.log(`...created new proposal with id ${key}:`, proposalData);
    } catch (error) {
      console.log('Error in actions/proposals/createProposal: ', error);
      throw error;
    }
  };
}

export function updateProposal(id, title, description, price, projectId) {
  return async (dispatch) => {
    try {
      console.log(`Attempting to update proposal with id: ${id}...`);

      const dataToUpdate = {
        title,
        description,
        price,
        projectId,
      };

      const returnedProposalData = await firebase
        .database()
        .ref(`proposals/${id}`)
        .update(dataToUpdate);

      console.log(`...updated proposal with id ${id}:`, returnedProposalData);

      dispatch({
        type: UPDATE_PROPOSAL,
        pid: id,
        proposalData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/proposals/updateProposal: ', error);
      throw error;
    }
  };
}

export function changeProposalStatus(id, status) {
  return async (dispatch) => {
    try {
      console.log(`Attempting to update status of proposal with id: ${id} to '${status}'...`);

      const returnedProposalData = await firebase
        .database()
        .ref(`proposals/${id}`)
        .update({ status });

      console.log(`...updated proposal with id ${id}:`, returnedProposalData);

      dispatch({
        type: CHANGE_PROPOSAL_STATUS,
        pid: id,
        proposalData: {
          status,
        },
      });
    } catch (error) {
      console.log('Error in actions/proposals/changeProposalStatus: ', error);
      throw error;
    }
  };
}
