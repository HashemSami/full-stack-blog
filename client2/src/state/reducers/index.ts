import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user.reducer";
import flashMessagesReducer from "./flashMessages.reducer";
import searchReducer from "./search.reducer";
import chatReducer from "./chat.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["currentUser"],
};

const reducers = combineReducers({
  currentUser: userReducer,
  flashMessages: flashMessagesReducer,
  search: searchReducer,
  chat: chatReducer,
});

export default persistReducer(persistConfig, reducers);

export type RootState = ReturnType<typeof reducers>;
