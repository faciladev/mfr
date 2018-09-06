import React, { Component } from "react";
import { SearchTreeView } from "@zippytech/react-toolkit/TreeView";
import "@zippytech/react-toolkit/TreeView/index.css";

class TreeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: null,
      selected: null
    };
  }

  onSelectionChange({ node }) {
    this.setState({ selected: node });
  }

  render() {
    return (
      <SearchTreeView
        collapsedDepth={0}
        enableSelection
        selected={this.state.selected}
        collapsed={this.state.collapsed}
        dataSource={this.props.dataSource}
        onCollapsedChange={({ collapsedMap: collapsed }) => {
          this.setState({ collapsed });
        }}
        onSelectionChange={this.props.onSelectionChange}
      />
    );
  }
}

export default TreeMenu;
