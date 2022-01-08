import axios from "axios";
import { jobsActionTypes } from "../reducers/actionTypes";

export const fetchAll = () => async (dispatch) => {
  const response = await axios.get("api/jobs");
  dispatch({
    type: jobsActionTypes.FETCH_ALL_JOBS,
    payload: response.data,
  });
};
export const fetchAllUserPosted = (userId) => async (dispatch) => {
  const response = await axios.get("api/jobs/userPosted/"+userId);
  dispatch({
    type: jobsActionTypes.FETCH_ALL_JOBS_USER_POSTED,
    payload: response.data,
  });
};
export const fetchAllUserBidded = (userId) => async (dispatch) => {
  const response = await axios.get("api/jobs/userBidded/"+userId);
  dispatch({
    type: jobsActionTypes.FETCH_ALL_JOBS_USER_BIDDED,
    payload: response.data,
  });
};
export const fetchAllUserFinished = (userId) => async (dispatch) => {
  const response = await axios.get("api/jobs/userFinished/"+userId);
  dispatch({
    type: jobsActionTypes.FETCH_ALL_JOBS_USER_FINISHED,
    payload: response.data,
  });
};
export const findById = (id) => async (dispatch) => {
  const response = await axios.get("api/jobs/" + id);
  dispatch({
    type: jobsActionTypes.FETCH_SINGLE_JOB,
    payload: response.data,
  });
  return response.data;
};
export const findByCompletedJobId = (jobId) => async (dispatch) => {
  const response = await axios.get("api/jobs/byCompletedJob/" + jobId);
  dispatch({
    type: jobsActionTypes.FETCH_SINGLE_JOB_BY_COMPLETED_JOB,
    payload: response.data,
  });
  return response.data;
};

export const completeJob = (jobId) => async (dispatch) => {
  const response = await axios.post("api/jobs/completeJob/"+jobId);
  dispatch({
    type: jobsActionTypes.COMPLETE_JOB,
    payload: response.data,
  });
  return response.data;
};
export const create = (newJob) => async (dispatch) => {
  const response = await axios.post("api/jobs", newJob);
  dispatch({
    type: jobsActionTypes.CREATE_JOB,
    payload: response.data,
  });
  return response.data;
};
export const edit = (editJob) => async (dispatch) => {
  const response = await axios.put("api/jobs/" + editJob.job.id, editJob);
  dispatch({
    type: jobsActionTypes.EDIT_JOB,
    payload: response.data,
  });
  return response.data;
};

const asyncArrayOfBools = async (arr, mapCriteria) => await Promise.all(arr.map(mapCriteria));

export const fetchByWordAndTech = (word, technologies, notReserved) => async (dispatch) => {
  const response = await axios.post("api/jobs/search", {word, technologies, notReserved});

  dispatch({
    type: jobsActionTypes.SEARCH_JOBS_BY_WORD_AND_TECH,
    payload: response.data,
  });
  return response.data;




  // const response = await axios.get("api/jobs");

  // const searchWord = response.data.filter(
  //   (job) =>
  //   {
  //    return (notReserved?!job.reserved:true) && 
  //    (job.title.toLowerCase().includes(word.toLowerCase()) ||
  //     job.description.toLowerCase().includes(word.toLowerCase()))
  //   }
  // );


  
  // const filterTechs = async(job)=>{
  //   if(technologies.length == 0){
  //     return true;
  //   }
  //   const response = await axios.get("api/technologies/byJobId/"+ job.id);

  //   if((response.data.map(x=>x.id)).includes(...technologies)){
  //     return true;
  //   }
  //   return false;
  // }
  
  // let techsBools = await asyncArrayOfBools(searchWord, filterTechs);
  // let jobs = searchWord.filter((job, i)=>techsBools[i]);

  

  // dispatch({
  //   type: jobsActionTypes.SEARCH_JOBS_BY_WORD_AND_TECH,
  //   payload: jobs,
  // });
  // return jobs;
};
