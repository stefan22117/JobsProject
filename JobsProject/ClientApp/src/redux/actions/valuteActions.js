import axios from "axios";
// import { jobsActionTypes } from "../reducers/actionTypes";

export const fetchAll = () => async () => {
  
      const response = await axios.get("api/valutes");
      return response.data;

};
export const fetchById = (valuteId) => async () => {
  
      const response = await axios.get("api/valutes/"+ valuteId);
      return response.data;

};