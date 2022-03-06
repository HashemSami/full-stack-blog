import { ChatActionTypes } from "../action-types";

interface ToggleChat {
  type: ChatActionTypes.Toggle_CHAT;
}

interface CloseChat {
  type: ChatActionTypes.CLOSE_CHAT;
}

interface AddUnreadChatCount {
  type: ChatActionTypes.ADD_UNREAD_CHAT_COUNT;
}

interface ClearUnreadChatCount {
  type: ChatActionTypes.CLEAR_UNREAD_CHAT_COUNT;
}

export type ChatActions =
  | ToggleChat
  | CloseChat
  | AddUnreadChatCount
  | ClearUnreadChatCount;
