import axios from 'axios';
import {chargesActionTypes} from '../reducers/actionTypes'

export const fetchAll = () => async (dispatch) => {

    const response = await axios.get("api/chargeMoney");
    dispatch({
      type: chargesActionTypes.FETCH_ALL_CHARGES,
      payload: response.data,
    });
  };

export const fetchAllByUserId =(userId) =>async (dispatch) => {
  const response = await axios.get('api/chargeMoney/byUserId/'+userId);
  dispatch({
    type: chargesActionTypes.FETCH_ALL_CHARGES_BY_USER_ID,
    payload: response.data,
  });
}

export const createCharge =(charge) =>async (dispatch) => {
  const response = await axios.post('api/chargeMoney', charge);
  dispatch({
    type: chargesActionTypes.CREATE_CHARGE,
    payload: response.data,
  });
}

export const accept = (chargeId) => async (dispatch) => {

    const response = await axios.post("api/chargeMoney/accept/"+chargeId);
    dispatch({
      type: chargesActionTypes.ACCEPT_CHARGE,
      payload: response.data,
    });
  };
export const decline = (chargeId) => async (dispatch) => {

  const response = await axios.post("api/chargeMoney/decline/"+chargeId);
    dispatch({
      type: chargesActionTypes.DECLINE_CHARGE,
      payload: response.data,
    });
  };


 export const refresh = (ids) => async (dispatch) => {

   const response = await axios.get("api/chargeMoney");
   
   const list = response.data.filter(x=>ids.includes(x.id));
   console.log('action', list)
   dispatch({
     type: chargesActionTypes.REFRESH_CHARGES,
     payload: list,
    });
    console.log('action2')
  };

  

  const formatChargeDate = (dateStr) => {
    const date = new Date(dateStr);
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    const [hour, minutes] = [
      date.getHours(),
      date.getMinutes(),
      // date.getSeconds(),
    ];

    return `${hour < 10 ? "0" + hour : hour}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${day}/${month}/${year}`;
  };


export const searchCharges = (options) => async (dispatch) => {

    const response = await axios.get("api/chargeMoney");

    var chargesList = [...response.data];
    if(options.status && options.status !='all'){
      chargesList = chargesList.filter(x=>x.status == options.status)
    }
    if(options.searchWord){

      chargesList = chargesList.filter(x=> 
        x?.user.name.toLowerCase().includes(options.searchWord.toLowerCase()) ||
        x?.user.email.toLowerCase().includes(options.searchWord.toLowerCase()) ||
        (x.amount + '').includes(options.searchWord) ||
        formatChargeDate(x.createdDateTime).includes(options.searchWord)
        )
      }
      dispatch({
      type: chargesActionTypes.SEARCH_CHARGES_BY_STATUS_WORD_AND_AMOUNT,
      payload: chargesList,
    });
  };

  export const getUncheckedCharges = (userId) =>async (dispatch)=>{

    const response = await axios.get('api/chargeMoney/getUncheckedNumber/'+userId);
    dispatch({
      type:chargesActionTypes.GET_UNCHECKED_CHARGES,
      payload: response.data
    })
    return response.data
  }
  export const updateAdminChargesNumber = (userId) =>async (dispatch)=>{

    const response = await axios.get('api/chargeMoney/getAdminChargesNumber/'+userId);
    dispatch({
      type:chargesActionTypes.GET_ADMIN_CHARGES_NUMBER,
      payload: response.data
    })
    return response.data
  }
  export const checkCharge = (chargeId) =>async (dispatch)=>{

    const response = await axios.post('api/chargeMoney/checkCharge/'+chargeId);
    dispatch({
      type:chargesActionTypes.CHECK_CHARGE,
      payload: response.data
    })
    return response.data
  }