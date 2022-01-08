import axios from "axios";
import { usersActionTypes } from "../reducers/actionTypes";

export const register = (info, log) => async (dispatch) => {

  dispatch({
    type: usersActionTypes.USER_ERRORS,
    payload: {},
  });

  return Promise.resolve(
    axios
      .post("api/auth/register", info)
      .then((response) => {
        dispatch({
          type: usersActionTypes.REGISTER,
          payload: response.data,
        });
        if (log) {
          login({
            email: info.email,
            password: info.password1,
          })(dispatch);
        }
        return true;
      })
      .catch((error) => {
        console.error(error.response.data);
        dispatch({
          type: usersActionTypes.USER_ERRORS,
          payload: error.response.data,
        });
        return false;
      })
  );
 
};

export const login = (credentials) => async (dispatch) => {
  
  dispatch({
    type: usersActionTypes.USER_ERRORS,
    payload: {},
  });

  return Promise.resolve(
    axios
      .post("api/auth/login", credentials)
      .then((response) => {
        dispatch({
          type: usersActionTypes.LOGIN,
          payload: response.data,
        });
        return true;
      })
      .catch((error) => {
        console.error(error.response.data);
        dispatch({
          type: usersActionTypes.USER_ERRORS,
          payload: error.response.data,
        });
        return false;
      })
  );
};

export const getLoggedUser = () => async (dispatch) => {
  const response = await axios.get("api/auth/user");
  console.log("i got user", response.data); //??
  dispatch({
    type: usersActionTypes.GET_USER,
    payload: response.data,
  });
  return response.data;
};


export const logout = () => async (dispatch) => {
  const response = await axios.post("api/auth/logout");
  dispatch({
    type: usersActionTypes.LOGOUT,
    //no payload
  });
};
