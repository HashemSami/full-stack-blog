import { ChatActionTypes } from "../action-types";

interface OpenChat {
  type: ChatActionTypes.OPEN_CHAT;
}

interface CloseChat {
  type: ChatActionTypes.CLOSE_CHAT;
}

export type ChatActions = OpenChat | CloseChat;
