import { chargesActionTypes } from "./actionTypes";
const initialState = {
  list: [],
  uncheckedCharges : [],
  adminChargesNumber: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case chargesActionTypes.FETCH_ALL_CHARGES:
    case chargesActionTypes.FETCH_ALL_CHARGES_BY_USER_ID:
    case chargesActionTypes.SEARCH_CHARGES_BY_STATUS_WORD_AND_AMOUNT:
    case chargesActionTypes.REFRESH_CHARGES:
    case chargesActionTypes.CHECK_CHARGE:
        return {
            ...state,
            list: action.payload,
        };
        
        case chargesActionTypes.GET_UNCHECKED_CHARGES:
            return {
                ...state,
                uncheckedChargesNumber: action.payload,
            };
            
        
        case chargesActionTypes.GET_ADMIN_CHARGES_NUMBER:
            return {
                ...state,
                adminChargesNumber: action.payload,
            };
            
    case chargesActionTypes.CREATE_CHARGE:
    default:
      return state;
  }
};
