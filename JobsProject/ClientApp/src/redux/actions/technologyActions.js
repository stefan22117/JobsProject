import axios from "axios";
import { technologiesActionTypes } from "../reducers/actionTypes";


export const fetchAll = () => async (dispatch) => {
    const response = await axios.get("api/technologies");
    dispatch({
      type: technologiesActionTypes.FETCH_ALL_TECHNOLOGIES,
      payload: response.data,
    });
  };

export const fetchByJobId = (jobId) => async (dispatch) => {
    const response = await axios.get("api/technologies/byJobId/"+jobId);
    dispatch({
      type: technologiesActionTypes.FETCH_TECHNOLOGIES_BY_JOB,
       payload: response.data, 
    });
    return response.data;
  };
export const emptyByJob = () => async (dispatch) => {
    dispatch({
      type: technologiesActionTypes.EMPTY_TECHNOLOGIES_BY_JOB,
       payload: [], 
    });
  };
export const fetchByUserId = (userId) => async (dispatch) => {
    const response = await axios.get("api/technologies/byFreelancerId/"+userId);
    dispatch({
      type: technologiesActionTypes.FETCH_TECHNOLOGIES_BY_USER,
       payload: response.data,
    });
    return response.data;
  };


  export const attachTechToUser = (tech) => async (dispatch) => {
    dispatch({
      type: technologiesActionTypes.ATTACH_TECHNOLOGY_TO_USER,
       payload: tech, 
    });
  };

  export const detachTechFromUser = (tech) => async (dispatch) => {
    dispatch({
      type: technologiesActionTypes.DETACH_TECHNOLOGY_FROM_USER,
       payload: tech, 
    });
  };
  export const attachTechToJob = (tech) => async (dispatch) => {
    dispatch({
      type: technologiesActionTypes.ATTACH_TECHNOLOGY_TO_JOB,
       payload: tech, 
    });
  };

  export const detachTechFromJob = (tech) => async (dispatch) => {
    dispatch({
      type: technologiesActionTypes.DETACH_TECHNOLOGY_FROM_JOB,
       payload: tech, 
    });
  };