import { ChatActions } from "../actions";
import { ChatActionTypes } from "../action-types";

export const toggleChat = (): ChatActions => {
  return { type: ChatActionTypes.Toggle_CHAT };
};

export const closeChat = (): ChatActions => {
  return { type: ChatActionTypes.CLOSE_CHAT };
};

export const addUnreadChatCount = (): ChatActions => {
  return { type: ChatActionTypes.ADD_UNREAD_CHAT_COUNT };
};

export const clearUnreadChatCount = (): ChatActions => {
  return { type: ChatActionTypes.CLEAR_UNREAD_CHAT_COUNT };
};
