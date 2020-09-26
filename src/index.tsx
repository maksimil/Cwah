import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./pages/Login";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Route exact={true} path="/" component={Login} />
      <Route exact={true} path="/gaem" component={() => <div>Piss</div>} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
