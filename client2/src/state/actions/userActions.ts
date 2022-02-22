import { UserActionTypes } from "../action-types";

interface Login {
  type: UserActionTypes.LOGIN;
}

interface Logout {
  type: UserActionTypes.LOGOUT;
}

interface FlashMessages {
  type: UserActionTypes.ADD_FLASH_MESSAGE;
  payload: string;
}

export type UserActions = Login | Logout | FlashMessages;
