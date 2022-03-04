import { UserActionTypes } from "../action-types";
import { User } from "../../models";

interface Login {
  type: UserActionTypes.LOGIN;
  payload: {
    isLoggedIn: boolean;
    username: string;
    token: string;
    avatar: string;
  };
}

interface Logout {
  type: UserActionTypes.LOGOUT;
}

interface SetUserProfile {
  type: UserActionTypes.SET_USER_PROFILE;
  payload: User;
}

export type UserActions = Login | Logout;
