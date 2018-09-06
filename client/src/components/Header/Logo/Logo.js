import React from "react";

import Logo from "../../../assets/img/logo.png";

const logo = props => (
  <div className="header__logo">
    <img className="header__logo__image" alt="Logo" src={Logo} />
    {/* <svg className="header__logo__image">
      <use xlinkHref={Logo + `#logo`} width="30px" />
    </svg> */}
    <h1 className="header__logo__name">
      Federal Ministry of Health <br />{" "}
      <span>Master Facility Registry (MFR)</span>
    </h1>
  </div>
);

export default logo;
