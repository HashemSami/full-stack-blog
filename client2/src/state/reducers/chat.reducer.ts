import { ChatActionTypes } from "../action-types";
import { ChatActions } from "../actions";

interface ChatState {
  isChatOpen: boolean;
}

const initailState: ChatState = {
  isChatOpen: false,
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

    default:
      return state;
  }
};

export default chatReducer;
