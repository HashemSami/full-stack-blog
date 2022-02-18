import React, { FC } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as browserHistory from "history";

import { AppContainer } from "./index.styles";
import MainPage from "./pages/MainPage.component";

import Axios from "axios";
Axios.defaults.baseURL = "http://localhost:8000/api/v0";

const App: FC = () => {
  return (
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
