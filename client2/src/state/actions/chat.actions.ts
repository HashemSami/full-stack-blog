import { ChatActionTypes } from "../action-types";

interface OpenChat {
  type: ChatActionTypes.OPEN_CHAT;
}

interface CloseChat {
  type: ChatActionTypes.CLOSE_CHAT;
}

interface AddChatCount {
  type: ChatActionTypes.ADD_CHAT_COUNT;
}

export type ChatActions = OpenChat | CloseChat | AddChatCount;
