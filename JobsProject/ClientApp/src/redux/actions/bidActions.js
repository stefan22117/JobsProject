import axios from "axios";
import { bidsActionTypes } from "../reducers/actionTypes";

export const create = (newBid) => async (dispatch) => {
  const bid = await fetchByJobIdAndUserId(newBid.jobId, newBid.userId)(dispatch)
  if(!bid.id){
    const response = await axios.post("api/bids", newBid);
    dispatch({
      type: bidsActionTypes.BID_FOR_JOB,
      // payload: response.data, //no payload
    });
    
    return true;
  }
  return false;
  };

  export const fetchByJobId = (jobId) => async (dispatch) => {
    const response = await axios.get("api/bids/jobId/"+jobId);
    dispatch({
      type: bidsActionTypes.FETCH_BIDS_BY_JOB,
       payload: response.data, 
    });
  };
  export const remove = (bidId) => async (dispatch) => {
    const response = await axios.delete("api/bids/"+bidId);
    dispatch({
      type: bidsActionTypes.REMOVE_BID,
      //  payload: response.data, 
    });
  };
  export const emptySingleBid = () => async (dispatch) => {
    dispatch({
      type: bidsActionTypes.EMPTY_BID,
      payload: {},
    });
  };
  export const updateSingleBid = (bid) => async (dispatch) => {
    dispatch({
      type: bidsActionTypes.UPDATE_BID,
      payload: bid, 
    });
  };

export const fetchByJobIdAndUserId = (jobId, userId) => async (dispatch) => {
    const response = await axios.get("api/bids/"+jobId+"/"+userId);
    dispatch({
      type: bidsActionTypes.FETCH_BIDS_BY_JOB_AND_USER,
       payload: response.data, 
    });
    return response.data;
  };