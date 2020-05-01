import Proposal from '../../models/proposal';

export const DELETE_PROPOSAL = 'DELETE_PROPOSAL';
export const CREATE_PROPOSAL = 'CREATE_PROPOSAL';
export const UPDATE_PROPOSAL = 'UPDATE_PROPOSAL';
export const SET_PROPOSALS = 'SET_PROPOSALS';
export const CHANGE_PROPOSAL_STATUS = 'CHANGE_PROPOSAL_STATUS';

export function fetchProposals() {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    ('START----------actions/proposals/fetchProposals--------');

    // Perform the API call - fetching all proposals
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/proposals.json'
      );
      const resData = await response.json();
      const loadedProposals = [];
      for (const key in resData) {
        loadedProposals.push(
          new Proposal(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].description,
            resData[key].price,
            resData[key].date
          )
        );
      }
      console.log('Dispatch SET_PROPOSALS, passing it loadedProposals');
      // Set our proposals in the reducer
      dispatch({
        type: SET_PROPOSALS,
        proposals: loadedProposals,
        userProposals: loadedProposals.filter(
          (proposal) => proposal.ownerId === userId
        ),
      });
      // Set a loading flag to false in the reducer
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/proposals/fetchProposals--------END');
    } catch (error) {
      console.log('ERROR: ', error);
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/proposals/fetchProposals--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export const deleteProposal = (proposalId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals/${proposalId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }
    dispatch({ type: DELETE_PROPOSAL, pid: proposalId });
  };
};

export function createProposal(title, description, price) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log('START----------actions/proposals/createProposal--------');

      const proposalData = {
        ownerId: userId,
        title,
        description,
        price,
        date: currentDate,
      };

      // Perform the API call - create the proposal, passing the proposalData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/proposals.json?auth=${token}`,
        {
          method: 'POST',
          body: JSON.stringify(proposalData),
        }
      );
      const returnedProposalData = await response.json();

      console.log('dispatching CREATE_PROPOSAL');

      dispatch({
        type: CREATE_PROPOSAL,
        proposalData: {
          id: returnedProposalData.name,
          ownerId: userId,
          title,
          description,
          price,
          date: currentDate,
        },
      });

      console.log('----------actions/proposals/createProposal--------END');
      dispatch({ type: 'LOADING', loading: false });
    } catch (error) {
      console.log('ERROR: ', error);
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/proposals/createProposal--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function updateProposal(id, title, description, price) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });

    try {
      console.log('START----------actions/proposals/updateProposal--------');

      const dataToUpdate = {
        title,
        description,
        price,
      };

      // Perform the API call - create the proposal, passing the proposalData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/proposals/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          body: JSON.stringify(dataToUpdate),
        }
      );
      const returnedProposalData = await response.json();

      console.log(
        'returnedProposalData from updating proposal, after patch',
        returnedProposalData
      );

      console.log('dispatching UPDATE_PROPOSAL');

      dispatch({
        type: UPDATE_PROPOSAL,
        pid: id,
        proposalData: dataToUpdate,
      });

      console.log('----------actions/proposals/updateProposal--------END');
      dispatch({ type: 'LOADING', loading: false });
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/proposals/updateProposal--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export const changeProposalStatus = (id, status) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: CHANGE_PROPOSAL_STATUS,
      pid: id,
      proposalData: {
        status,
      },
    });
  };
};
