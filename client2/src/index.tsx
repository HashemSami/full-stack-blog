import React, { FC } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import MainPage from "./pages/MainPage.component";

import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8000/api/v0";

import { Provider } from "react-redux";
import { store } from "./state";

const App: FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    </Provider>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
