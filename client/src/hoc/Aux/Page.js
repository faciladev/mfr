import React, { Component } from "react";
import Aux from "../../hoc/Aux/Aux";
import Divider from "../../components/UI/Divider";

class Page extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Aux>
        <div className="page">
          <div className="page__header">
            <h1 className="page__title">{this.props.title}</h1>
            <p className="page__description">{this.props.description}</p>
            {this.props.header}
          </div>
          <Divider />
          <div className="page__body">{this.props.children}</div>
        </div>
      </Aux>
    );
  }
}

export default Page;
