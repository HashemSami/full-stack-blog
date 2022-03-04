import { SearchActionTypes } from "../action-types";

interface OpenSearch {
  type: SearchActionTypes.OPEN_SEARCH;
}

interface CloseSearch {
  type: SearchActionTypes.CLOSE_SEARCH;
}

export type SearchActions = OpenSearch | CloseSearch;
