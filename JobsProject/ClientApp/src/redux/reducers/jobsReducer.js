import { jobsActionTypes } from "./actionTypes";
const initialState = {
  list: [],
  singleJob: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case jobsActionTypes.FETCH_ALL_JOBS:
    case jobsActionTypes.FETCH_ALL_JOBS_USER_POSTED:
    case jobsActionTypes.FETCH_ALL_JOBS_USER_BIDDED:
    case jobsActionTypes.FETCH_ALL_JOBS_USER_FINISHED:
    case jobsActionTypes.SEARCH_JOBS_BY_WORD_AND_TECH:
      return {
        ...state,
        list: action.payload,
      };
    case jobsActionTypes.FETCH_SINGLE_JOB:
      case jobsActionTypes.FETCH_SINGLE_JOB_BY_COMPLETED_JOB:
      return {
        ...state,
        singleJob: action.payload,
      };

    case jobsActionTypes.CREATE_JOB:
    case jobsActionTypes.EDIT_JOB:
      return state;
    default:
      return state;
  }
};
