import axios from 'axios';
import {freelancersActionTypes} from '../reducers/actionTypes'

export const fetchAll = () => async (dispatch) => {

    const response = await axios.get("api/freelancers");
    dispatch({
      type: freelancersActionTypes.FETCH_ALL_FREELANCERS,
      payload: response.data,
    });
  };
  export const findById = (id) => async (dispatch) => {
    const response = await axios.get("api/freelancers/" + id);
    dispatch({
      type: freelancersActionTypes.FETCH_SINGLE_FREELANCER,
      payload: response.data,
    });
    return response.data;
  };


  export const fetchForInbox = (id) => async (dispatch) => {
    const response = await axios.get("api/freelancers/forInbox/" + id);
    dispatch({
      type: freelancersActionTypes.FETCH_FREELANCERS_FOR_INBOX,
      payload: response.data,
    });
    return response.data;
  };

  
const asyncArrayOfBools = async (arr, mapCriteria) => await Promise.all(arr.map(mapCriteria));

export const fetchByWordAndTech = (word, technologies) => async (dispatch) => {

  const response = await axios.post("api/freelancers/search", {word, technologies});

  dispatch({
    type: freelancersActionTypes.SEARCH_FREELANCERS_BY_WORD_AND_TECH,
    payload: response.data,
  });
  return response.data;


  // return
  // const response = await axios.get("api/freelancers");
  

  // const searchWord = response.data.filter(
  //   (freelancer) =>
  //   freelancer.name.toLowerCase().includes(word.toLowerCase())
  //   // || freelancer.description.toLowerCase().includes(word.toLowerCase())
  // );

  // const filterTechs = async(freelancer)=>{
  //   if(technologies.length == 0){
  //     return true;
  //   }
  //   const b = await axios.get("api/technologies/byFreelancerId/"+ freelancer.id);//dodati u c#

  //   if((b.data.map(x=>x.id)).includes(...technologies)){
  //     return true;
  //   }
  //   return false;
  // }

  // let techsBools = await asyncArrayOfBools(searchWord, filterTechs);
  // let freelancers = searchWord.filter((freelancer, i)=>techsBools[i]);

  // dispatch({
  //   type: freelancersActionTypes.SEARCH_FREELANCERS_BY_WORD_AND_TECH,
  //   payload: freelancers,
  // });
  // return freelancers;
};


export const getUnreadMessages = (userId) =>async (dispatch)=>{

  const response = await axios.get('chat/getUnreadNumber/'+userId);
  dispatch({
    type:freelancersActionTypes.GET_UNREAD_MESS_FOR_FREELANCER,
    payload: response.data
  })

  return response.data
}
export const update = (userId, user) => async (dispatch)=>{

  const response = await axios.put('api/freelancers/'+userId, user);

  dispatch({
    type:freelancersActionTypes.UPDATE_FREELANCER,
    // payload: response.data
  })

  return response.data
}

export const emailVerifyRequset = () => {
  return axios.post('api/freelancers/emailVerifyRequset');//.then(()=>true).catch(e=>false)
// return await Promise.resolve(
//   axios.post('api/freelancers/emailVerifyRequset').then(()=>true).catch(e=>false)
//   );
}
export const emailVerify = async (token) => {
return axios.post('api/freelancers/emailVerify/'+ token)
}


export const chooseForMessage = (id) => async (dispatch) => {
  const response = await axios.get("api/freelancers/" + id);
  dispatch({
    type: freelancersActionTypes.CHOOSE_FREELANCER_FOR_MESSAGE,
    payload: response.data,
  });
  return response.data;
}
export const removeForMessage = () => async (dispatch) => {
  dispatch({
    type: freelancersActionTypes.REMOVE_FREELANCER_FOR_MESSAGE,
    payload: {},
  });
}