import { SearchActionTypes } from "../action-types";
import { SearchActions } from "../actions";

interface SearchState {
  isSearchOpen: boolean;
}

const initailState: SearchState = {
  isSearchOpen: false,
};

const searchReducer = (
  state: SearchState = initailState,
  action: SearchActions
): SearchState => {
  switch (action.type) {
    case SearchActionTypes.OPEN_SEARCH:
      return {
        ...state,
        isSearchOpen: true,
      };

    case SearchActionTypes.CLOSE_SEARCH:
      return {
        ...state,
        isSearchOpen: false,
      };

    default:
      return state;
  }
};

export default searchReducer;
