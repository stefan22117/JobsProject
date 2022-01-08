import { freelancersActionTypes } from "./actionTypes";
const initialState = {
  list: [],
  singleFreelancer: {},
  unreadMessages : [],
  freelancerForMessage:{}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case freelancersActionTypes.FETCH_ALL_FREELANCERS:
    case freelancersActionTypes.SEARCH_FREELANCERS_BY_WORD_AND_TECH:
      case freelancersActionTypes.FETCH_FREELANCERS_FOR_INBOX:
      return {
        ...state,
        list: action.payload,
      };

    case freelancersActionTypes.FETCH_SINGLE_FREELANCER:
      return {
        ...state,
        singleFreelancer: action.payload,
      };
    case freelancersActionTypes.GET_UNREAD_MESS_FOR_FREELANCER:
      return {
        ...state,
        unreadMessages: action.payload,
      };
    case freelancersActionTypes.UPDATE_FREELANCER:
      return {
        ...state,
        // : action.payload,
      };
      case freelancersActionTypes.CHOOSE_FREELANCER_FOR_MESSAGE:
        case freelancersActionTypes.REMOVE_FREELANCER_FOR_MESSAGE:
        return {
          ...state,
          freelancerForMessage: action.payload,
        };
    default:
      return state;
  }
};
