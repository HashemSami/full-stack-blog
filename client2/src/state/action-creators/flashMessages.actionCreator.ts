import { FlashMessagesActions } from "../actions";
import { FlashMessagesActionTypes } from "../action-types";

export const addFlashMessage = (msg: string): FlashMessagesActions => {
  return { type: FlashMessagesActionTypes.ADD_FLASH_MESSAGE, payload: msg };
};
