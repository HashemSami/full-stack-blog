import { FlashMessagesActionTypes } from "../action-types";
import { FlashMessagesActions } from "../actions";

interface FlashMessagesState {
  flashMessages: string[];
}

const initailState: FlashMessagesState = {
  flashMessages: [],
};

const flashMessagesReducer = (
  state: FlashMessagesState = initailState,
  action: FlashMessagesActions
): FlashMessagesState => {
  switch (action.type) {
    case FlashMessagesActionTypes.ADD_FLASH_MESSAGE:
      return {
        ...state,
        flashMessages: [...state.flashMessages, action.payload],
      };

    default:
      return state;
  }
};

export default flashMessagesReducer;
