import React from "react";

import Aux from "../Aux/Aux";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
const layout = props => (
  <Aux>
    <Header />
    <main className="content">{props.children}</main>
    <Footer />
  </Aux>
);

export default layout;
