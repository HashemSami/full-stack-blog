import { UserActionTypes } from "../action-types";
import { UserActions } from "../actions";

export const login = (): UserActions => {
  return { type: UserActionTypes.LOGIN };
};

export const logout = (): UserActions => {
  return { type: UserActionTypes.LOGOUT };
};

export const addFlashMessage = (msg: string): UserActions => {
  return { type: UserActionTypes.ADD_FLASH_MESSAGE, payload: msg };
};
