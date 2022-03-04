import { SearchActions } from "../actions";
import { SearchActionTypes } from "../action-types";

export const openSearch = (): SearchActions => {
  return { type: SearchActionTypes.OPEN_SEARCH };
};

export const closeSearch = (): SearchActions => {
  return { type: SearchActionTypes.CLOSE_SEARCH };
};
