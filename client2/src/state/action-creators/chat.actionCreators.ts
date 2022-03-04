import { ChatActions } from "../actions";
import { ChatActionTypes } from "../action-types";

export const openChat = (): ChatActions => {
  return { type: ChatActionTypes.OPEN_CHAT };
};

export const closeChat = (): ChatActions => {
  return { type: ChatActionTypes.CLOSE_CHAT };
};
