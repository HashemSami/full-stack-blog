import { ChatActionTypes } from "../action-types";
import { ChatActions } from "../actions";

interface ChatState {
  isChatOpen: boolean;
  unreadChatCount: number;
}

const initailState: ChatState = {
  isChatOpen: false,
  unreadChatCount: 0,
};

const chatReducer = (
  state: ChatState = initailState,
  action: ChatActions
): ChatState => {
  switch (action.type) {
    case ChatActionTypes.Toggle_CHAT:
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };

    case ChatActionTypes.CLOSE_CHAT:
      return {
        ...state,
        isChatOpen: false,
      };

    case ChatActionTypes.ADD_UNREAD_CHAT_COUNT:
      return {
        ...state,
        unreadChatCount: state.unreadChatCount + 1,
      };

    case ChatActionTypes.CLEAR_UNREAD_CHAT_COUNT:
      return {
        ...state,
        unreadChatCount: 0,
      };
    default:
      return state;
  }
};

export default chatReducer;
