import {
  DELETE_PROPOSAL,
  CREATE_PROPOSAL,
  UPDATE_PROPOSAL,
  SET_PROPOSALS
} from '../actions/proposals';
import Proposal from '../../models/proposal';

const initialState = {
  availableProposals: [],
  userProposals: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROPOSALS:
      return {
        availableProposals: action.proposals,
        userProposals: action.userProposals
      };
    case CREATE_PROPOSAL:
      const newProposal = new Proposal(
        action.proposalData.id,
        action.proposalData.ownerId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price,
        action.proposalData.date
      );
      return {
        ...state,
        availableProposals: state.availableProposals.concat(newProposal),
        userProposals: state.userProposals.concat(newProposal)
      };
    case UPDATE_PROPOSAL:
      const userProposalIndex = state.userProposals.findIndex(
        proj => proj.id === action.pid
      );
      const updatedUserProposal = new Proposal( //Whenever we do a new proposal we have to pass the full params to match model
        action.pid,
        state.userProposals[userProposalIndex].ownerId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price,
        state.userProposals[userProposalIndex].date
      );
      const updatedUserProposals = [...state.userProposals]; //copy current state of user proposals
      updatedUserProposals[userProposalIndex] = updatedUserProposal; //find the user proposal with the passed index (the one we should update)
      const availableProposalIndex = state.availableProposals.findIndex(
        proj => proj.id === action.pid
      );
      const updatedAvailableProposals = [...state.availableProposals];
      updatedAvailableProposals[availableProposalIndex] = updatedUserProposal;
      return {
        ...state,
        availableProposals: updatedAvailableProposals,
        userProposals: updatedUserProposals
      };
    case DELETE_PROPOSAL:
      return {
        ...state,
        userProposals: state.userProposals.filter(
          proposal => proposal.id !== action.pid
        ),
        availableProposals: state.availableProposals.filter(
          proposal => proposal.id !== action.pid
        )
      };
  }
  return state;
};
