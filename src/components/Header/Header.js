import React from "react";
import * as logo from "./../../assets/got-logo.jpg";
export const Header = () => (
  <header className="header">
    <div className="container">
      <img alt="Game of Thrones" className="logo" src={logo} />
      <h3 className="header-title">Prediction Pool</h3>
    </div>
  </header>
);