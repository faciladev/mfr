import React from "react";
import Aux from "../../hoc/Aux/Aux";
import Divider from "../../components/UI/Divider";

const page = props => (
  <Aux>
    <div className="page">
      <h1 className="page__title">{props.title}</h1>
      <p className="page__description">{props.description}</p>
    </div>
    <Divider />
    {props.children}
  </Aux>
);

export default page;
