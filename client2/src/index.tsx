import React, { FC } from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "./index.styles";
import MainPage from "./pages/MainPage.component";

const App: FC = () => {
  return <MainPage />;
};

ReactDOM.render(<App />, document.querySelector("#app"));
