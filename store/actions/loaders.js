// If you use Redux Thunk...
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
const store = createStore(reducer, applyMiddleware(thunk));

export function getUser(id) {
  // Redux Thunk will inject dispatch here:
  return (dispatch) => {
    // Reducers may handle this to set a flag like isFetching
    dispatch({ type: 'GET_USER_REQUEST', id });

    // Perform the actual API call
    return fetchUser().then(
      (response) => {
        // Reducers may handle this to show the data and reset isFetching
        dispatch({ type: 'GET_USER_SUCCESS', id, response });
      },
      (error) => {
        // Reducers may handle this to reset isFetching
        dispatch({ type: 'GET_USER_FAILURE', id, error });
        // Rethrow so returned Promise is rejected
        throw error;
      }
    );
  };
}

// Thunks can be dispatched, if Redux Thunk is applied,
// just like normal action creators:
store.dispatch(getUser(42));

// The return value of dispatch() when you dispatch a thunk *is*
// the return value of the inner function. This is why it's useful
// to return a Promise (even though it is not strictly necessary):
store
  .dispatch(getUser(42))
  .then(() => console.log('Fetched user and updated UI!'));

// Here is another thunk action creator.
// It works exactly the same way.
export function getPost(id) {
  return (dispatch) => {
    dispatch({ type: 'GET_POST_REQUEST', id });
    return fetchPost().then(
      (response) => dispatch({ type: 'GET_POST_SUCCESS', id, response }),
      (error) => {
        dispatch({ type: 'GET_POST_FAILURE', id, error });
        throw error;
      }
    );
  };
}

// Now we can combine them
export function getUserAndTheirFirstPost(userId) {
  // Again, Redux Thunk will inject dispatch here.
  // It also injects a second argument called getState() that lets us read the current state.
  return (dispatch, getState) => {
    // Remember I told you dispatch() can now handle thunks?
    return dispatch(getUser(userId)).then(() => {
      // Assuming this is where the fetched user got stored
      const fetchedUser = getState().usersById[userId];
      // Assuming it has a "postIDs" field:
      const firstPostID = fetchedUser.postIDs[0];
      // And we can dispatch() another thunk now!
      return dispatch(getPost(firstPostID));
    });
  };
}

// And we can now wait for the combined thunk:
store.dispatch(getUserAndTheirFirstPost(43)).then(() => {
  console.log('fetched a user and their first post');
});

// We can do this anywhere we have access to dispatch().
// For example, we can use this.props.dispatch, or put action
// creators right into the props by passing them to connect, like this:
// export default connect(mapStateToProps, { getUserAndTheirFirstPost })
