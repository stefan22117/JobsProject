import { technologiesActionTypes } from "./actionTypes";
const initialState = {
  list: [],
  technologiesByUserId: [],
  technologiesByJobId:[]
};


export default (state = initialState, action) => {
    switch (action.type) {

        case technologiesActionTypes.FETCH_ALL_TECHNOLOGIES:
            // case technologiesActionTypes.SEARCH_TECHNOLOGIES_BY_WORD:
            return {...state,
                list:action.payload
            };
            case technologiesActionTypes.FETCH_TECHNOLOGIES_BY_USER:
                return {...state,
                    technologiesByUserId:action.payload
                };
                case technologiesActionTypes.FETCH_TECHNOLOGIES_BY_JOB:
                case technologiesActionTypes.EMPTY_TECHNOLOGIES_BY_JOB:
                    return {...state,
                        technologiesByJobId:action.payload
                    };



                //DORADITI
                case technologiesActionTypes.ATTACH_TECHNOLOGY_TO_USER:
                    return {...state,
                        technologiesByUserId:[...state.technologiesByUserId, action.payload]
                    };
                case technologiesActionTypes.DETACH_TECHNOLOGY_FROM_USER:
                    return {...state,
                        technologiesByUserId:state.technologiesByUserId.filter(t=>t.id!= action.payload.id)
                    };
                case technologiesActionTypes.ATTACH_TECHNOLOGY_TO_JOB:
                    return {...state,
                        technologiesByJobId:[...state.technologiesByJobId, action.payload]
                    };
                case technologiesActionTypes.DETACH_TECHNOLOGY_FROM_JOB:
                    return {...state,
                        technologiesByJobId:state.technologiesByJobId.filter(t=>t.id!= action.payload.id)
                    };
                //DORADITI



        default:
            return state
    }
}