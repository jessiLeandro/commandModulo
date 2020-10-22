import { combineReducers } from "redux";
import { login } from "../Pages/Login/LoginRedux/reduce";

const appReducer = combineReducers({
  login,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT_AUTH") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
