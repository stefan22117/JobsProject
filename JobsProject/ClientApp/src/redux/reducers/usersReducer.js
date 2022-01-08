import { usersActionTypes } from "../reducers/actionTypes";
const initialState = {
  user: {
    loggedIn: false,
  },
  errors: [],
};

export default (state = initialState, action) => {

  switch (action.type) {
    case usersActionTypes.REGISTER:
      return state;

    case usersActionTypes.LOGIN:
    case usersActionTypes.GET_USER:
      return {
        ...state,
        user: {
          loggedIn: true,
          ...action.payload,
        },
        errors: [],
      };
    
    case usersActionTypes.LOGOUT:
      return {
        ...state,
        user: {
          loggedIn: false,
        },
        errors: [],
      };
    case usersActionTypes.USER_ERRORS:
      return {
        ...state,
        // errors: [...state.errors, action.payload],
        errors: action.payload.length ? action.payload:[action.payload]
      };
    default:
      return state;
  }
};
