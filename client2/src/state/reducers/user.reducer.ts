import { useReducer } from "react";
import { UserActionTypes } from "../action-types";
import { UserActions } from "../actions";
import { User } from "../../models";

const initailState: User = {
  isLoggedIn: false,
  username: "",
  token: "",
  avatar: "",
  userProfile: {
    avatar: "",
    username: "",
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 },
  },
};

const userReducer = (state: User = initailState, action: UserActions): User => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      return { ...state, ...action.payload };

    case UserActionTypes.LOGOUT:
      return {
        ...state,
        username: "",
        token: "",
        avatar: "",
        isLoggedIn: false,
      };

    default:
      return state;
  }
};

export default userReducer;
