import React from "react";
import { NavLink } from "react-router-dom";

const navigation = props => (
  <nav className="header__nav">
    <ul className="nav__container">
      <li className="nav__items">
        <NavLink exact to="/" className="nav__link nav__link">
          Home
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/about" className="nav__link">
          About
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/digest" className="nav__link">
          Digest
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/search" className="nav__link">
          Search Facility
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/geolocator" className="nav__link">
          Geolocator
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/apidocs" className="nav__link">
          API
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/faq" className="nav__link">
          FAQ
        </NavLink>
      </li>
      <li className="nav__items">
        <NavLink to="/contact" className="nav__link">
          Contact
        </NavLink>
      </li>
      {/* <li className="nav__items">
        <NavLink to="/login" className="nav__link">
          Login
        </NavLink>
      </li> */}
    </ul>
  </nav>
);

export default navigation;
