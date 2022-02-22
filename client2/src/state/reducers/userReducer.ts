import { useReducer } from "react";
import { UserActionTypes } from "../action-types";
import { UserActions } from "../actions";

interface userState {
  isLoggedIn: boolean;
  flashMessages: string[];
}

const initailState: userState = {
  isLoggedIn: Boolean(localStorage.getItem("appNameToken")),
  flashMessages: [],
};

const userReducer = (
  state: userState = initailState,
  action: UserActions
): userState => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      return { ...state, isLoggedIn: true };

    case UserActionTypes.LOGOUT:
      return { ...state, isLoggedIn: false };

    case UserActionTypes.ADD_FLASH_MESSAGE:
      return {
        ...state,
        flashMessages: [...state.flashMessages, action.payload],
      };

    default:
      return state;
  }
};

export default userReducer;
