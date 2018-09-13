import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions/index";
import Page from "../../hoc/Aux/Page";
// import Chart from "../../components/Data/Charts";
import Chart from "../../components/Chart/Chart";
import Spinner from "../../components/Spinner/Spinner";
import Card, { CardContainer } from "../../components/UI/Card";

class Digest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setting: [
        //First Chart - Operational Status
        {
          layer_id: 52,
          field_id: 111,
          chart_type: "pie"
        },
        //Second Chart - Ownership Type
        {
          layer_id: 45,
          field_id: 25,
          chart_type: "pie"
        },
        {
          layer_id: 45,
          field_id: 27,
          chart_type: "pie"
        },
        //Source of power
        {
          layer_id: 52,
          field_id: 117,
          chart_type: "pie"
        }
        //Water Source Type
        // {
        //   layer_id: 52,
        //   field_id: 121,
        //   chart_type: "pie"
        // }
        // {
        //   layer_id: 45,
        //   field_id: 27,
        //   chart_type: "pie"
        // }
      ]
    };
  }

  componentDidMount() {
    this.props.onLoadAllCharts(this.state.setting);
  }

  render() {
    return (
      <Page title="Digest" description="Data presentation using charts.">
        <CardContainer>
          {this.props.charts ? (
            this.props.charts.map((chart, idx) => (
              <Card key={idx} column={3}>
                <Chart {...chart} />
              </Card>
            ))
          ) : (
            <Spinner />
          )}
        </CardContainer>
      </Page>
    );
  }
}

const mapStatesToProps = state => {
  return {
    charts: state.chartReducer.charts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadAllCharts: setting => dispatch(actions.loadAllCharts(setting))
  };
};

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(Digest);
