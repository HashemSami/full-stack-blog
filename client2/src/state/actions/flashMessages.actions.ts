import { FlashMessagesActionTypes } from "../action-types";

interface FlashMessages {
  type: FlashMessagesActionTypes.ADD_FLASH_MESSAGE;
  payload: string;
}

export type FlashMessagesActions = FlashMessages;
