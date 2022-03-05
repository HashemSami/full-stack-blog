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
    case ChatActionTypes.OPEN_CHAT:
      return {
        ...state,
        isChatOpen: true,
      };

    case ChatActionTypes.CLOSE_CHAT:
      return {
        ...state,
        isChatOpen: false,
      };

    case ChatActionTypes.ADD_CHAT_COUNT:
      return {
        ...state,
        unreadChatCount: state.unreadChatCount + 1,
      };
    default:
      return state;
  }
};

export default chatReducer;
