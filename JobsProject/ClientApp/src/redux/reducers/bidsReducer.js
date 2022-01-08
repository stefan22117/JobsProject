import { bidsActionTypes } from "./actionTypes";
const initialState = {
  list: [],
  singleBid: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case bidsActionTypes.FETCH_ALL_BIDS:
    case bidsActionTypes.FETCH_BIDS_BY_JOB:
    case bidsActionTypes.FETCH_BIDS_BY_JOB_AND_USER:
      return { ...state, list: action.payload };
      
      case bidsActionTypes.UPDATE_BID:
      case bidsActionTypes.EMPTY_BID:
        return { ...state, singleBid: action.payload };
      
      case bidsActionTypes.BID_FOR_JOB:
      case bidsActionTypes.REMOVE_BID:
        default:
      return state;
  }
};
