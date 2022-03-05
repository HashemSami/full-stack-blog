import { UserActionTypes } from "../action-types";
import { UserActions } from "../actions";
import { User } from "../../models";
import { Dispatch } from "redux";

import { loginUser, getProfileData } from "../../api/userApi";

export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch<UserActions>) => {
    const data = await loginUser(username, password);

    if (data) {
      // localStorage.setItem("appNameToken", data.token);
      // localStorage.setItem("appNameUsername", data.username);
      // localStorage.setItem("appNameAvatar", data.avatar);

      dispatch({
        type: UserActionTypes.LOGIN,
        payload: { ...data, isLoggedIn: true },
      });
    } else {
      console.log("oth");
      logout();
    }
  };
};

export const setUserProfile = (username: string, token: string) => {
  return async (dispatch: Dispatch<UserActions>) => {
    const data = await getProfileData(username, token);

    // if (data) {
    //   console.log("user loggedin", data);
    //   // localStorage.setItem("appNameToken", data.token);
    //   // localStorage.setItem("appNameUsername", data.username);
    //   // localStorage.setItem("appNameAvatar", data.avatar);

    //   dispatch({
    //     type: UserActionTypes.LOGIN,
    //     payload: { ...data, isLoggedIn: true },
    //   });
    // } else {
    //   console.log("oth");
    //   logout();
    // }
  };
};

export const logout = () => {
  return (dispatch: Dispatch<UserActions>) => {
    // localStorage.removeItem("appNameToken");
    // localStorage.removeItem("appNameUsername");
    // localStorage.removeItem("appNameAvatar");
    dispatch({ type: UserActionTypes.LOGOUT });
  };
};
