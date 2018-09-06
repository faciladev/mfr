import React from "react";

import Logo from "./Logo/Logo";
import Navigation from "./Navigation/Navigation";

const header = props => (
  <header className="header">
    <Logo />
    <Navigation />
  </header>
);

export default header;
