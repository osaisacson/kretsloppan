import Proposal from '../../models/proposal';

export const DELETE_PROPOSAL = 'DELETE_PROPOSAL';
export const CREATE_PROPOSAL = 'CREATE_PROPOSAL';
export const UPDATE_PROPOSAL = 'UPDATE_PROPOSAL';
export const SET_PROPOSALS = 'SET_PROPOSALS';

export const fetchProposals = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/proposals.json'
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = errorId;
        throw new Error(message);
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
            resData[key].price,
            resData[key].date
          )
        );
      }

      dispatch({
        type: SET_PROPOSALS,
        proposals: loadedProposals,
        userProposals: loadedProposals.filter(prod => prod.ownerId === userId)
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
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }
    dispatch({ type: DELETE_PROPOSAL, pid: proposalId });
  };
};

export const createProposal = (title, description, price) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();

    const proposalData = {
      ownerId: userId,
      title,
      description,
      price,
      date: date.toISOString()
    };

    //Then upload the rest of the data to realtime database on firebase
    fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals.json?auth=${token}`,
      {
        method: 'POST',
        body: JSON.stringify(proposalData)
      }
    )
      .catch(err =>
        console.log(
          'Error when attempting to save to firebase realtime database: ',
          err
        )
      )
      .then(finalRes => finalRes.json())
      .then(finalResParsed => {
        dispatch({
          type: CREATE_PROPOSAL,
          proposalData: {
            id: finalResParsed.name,
            ownerId: userId,
            title,
            description,
            price,
            date: date.toISOString()
          }
        });
      });
  };
};

export const updateProposal = (id, title, description, price) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;

    fetch(
      `https://egnahemsfabriken.firebaseio.com/proposals/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        body: JSON.stringify(proposalData)
      }
    )
      .catch(err =>
        console.log(
          'Error when attempting to save to firebase realtime database: ',
          err
        )
      )
      .then(finalRes => finalRes.json())
      .then(finalResParsed => {
        dispatch({
          type: UPDATE_PROPOSAL,
          pid: id,
          proposalData: {
            title,
            description,
            price
          }
        });
      });
  };
};
