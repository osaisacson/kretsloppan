export const LOADERS_BEGIN = 'LOADERS_BEGIN';
export const LOADERS_SUCCESS = 'LOADERS_SUCCESS';
export const LOADERS_FAILURE = 'LOADERS_FAILURE';

export const loadBegin = () => ({
  type: LOADERS_BEGIN,
});

export const loadSuccess = (dataToLoad) => ({
  type: LOADERS_SUCCESS,
  payload: { dataToLoad },
});

export const loadFailure = (error) => ({
  type: LOADERS_FAILURE,
  payload: { error },
});
