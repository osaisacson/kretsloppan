import Proposal from '../../models/proposal';

export const DELETE_PROPOSAL = 'DELETE_PROPOSAL';
export const CREATE_PROPOSAL = 'CREATE_PROPOSAL';
export const UPDATE_PROPOSAL = 'UPDATE_PROPOSAL';
export const SET_PROPOSALS = 'SET_PROPOSALS';

export const fetchProposals = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/proposals.json?auth=${token}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedProposals = [];

      for (const key in resData) {
        loadedProposals.push(
          new Proposal(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PROPOSALS,
        proposals: loadedProposals,
        userProposals: loadedProposals.filter(
          proposal => proposal.ownerId === userId
        )
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProposal = proposalId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals/${proposalId}.json?auth=${token}`,

      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_PROPOSAL, pid: proposalId });
  };
};

export const createProposal = (title, description, price) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          price,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PROPOSAL,
      proposalData: {
        id: resData.name,
        title,
        description,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateProposal = (id, title, description, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          price
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_PROPOSAL,
      pid: id,
      proposalData: {
        title,
        description,
        price
      }
    });
  };
};
