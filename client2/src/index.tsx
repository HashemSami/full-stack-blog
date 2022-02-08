import React, { FC } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppContainer } from "./index.styles";
import MainPage from "./pages/MainPage.component";

const App: FC = () => {
  return (
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
