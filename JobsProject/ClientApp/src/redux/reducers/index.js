import { combineReducers } from "redux";
import jobsReducer from "./jobsReducer";
import bidsReducer from "./bidsReducer";
import usersReducer from "./usersReducer";
import technologiesReducer from "./technologiesReducer";
import freelancersReducer from "./freelancersReducer";
import chargesReducer from "./chargesReducer";

export default combineReducers({
  jobsReducer,
  bidsReducer,
  usersReducer,
  technologiesReducer,
  freelancersReducer,
  chargesReducer
});
