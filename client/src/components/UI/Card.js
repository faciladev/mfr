import React from "react";

const card = props => (
  <div className={`card__item col-${props.column}`}>{props.children}</div>
);
export const CardContainer = props => (
  <div className="card__container">{props.children}</div>
);

export default card;
