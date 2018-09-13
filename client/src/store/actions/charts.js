import * as actionTypes from "./actionTypes";
import axios from "../../axios-resmap";
import axios_restricted from "../../axios-resmap-restricted";
import { prepareLink } from "../../shared/utility";

const chartData = {
  labels: ["Health Post", "Health Center", "Clinic", "Hospital"],
  datasets: [
    {
      label: "Facility Types",
      data: [617594, 181045, 153060, 106519],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)"
      ]
    }
  ]
};
const loadDigestFacilityType = data => {
  return {
    type: actionTypes.DIGEST_BY_FACILITY_TYPE_LOADED,
    payload: {
      labels: [
        "Hospital",
        "Clinic",
        "Health Center",
        "Health Post",
        "Lab",
        "Office"
        // "Dentist"
      ],
      datasets: [
        {
          label: "Facility Types",
          data: data,
          backgroundColor: [
            "rgba(255,105,145,0.6)",
            "rgba(155,100,210,0.6)",
            "rgba(90,178,255,0.6)",
            "rgba(240,134,67,0.6)",
            "rgba(120,120,120,0.6)",
            "rgba(250,55,197,0.6)"
          ]
        }
      ]
    }
  };
};

export const digestFacilityType = () => {
  return dispatch => {
    Promise.all([
      axios.get(
        prepareLink("collections/3/count.json?facility_type[under]=Hospital")
      ),
      axios.get(
        prepareLink("collections/3/count.json?facility_type[under]=Clinic")
      ),
      axios.get(
        prepareLink(
          "collections/3/count.json?facility_type[under]=Health_Center"
        )
      ),
      axios.get(
        prepareLink("collections/3/count.json?facility_type[under]=Health_Post")
      ),
      axios.get(
        prepareLink("collections/3/count.json?facility_type[under]=Lab")
      ),
      axios.get(
        prepareLink("collections/3/count.json?facility_type[under]=Office")
      )
      // ,
      // axios.get(
      //   prepareLink("collections/3/count.json?facility_type[under]=Dentist")
      // )
    ])
      .then(res => {
        const data = res.map(digest => digest.data);
        dispatch(loadDigestFacilityType(data));
      })

      .catch(err => console.log(err));
  };
};

const loadDigestOperationalStatus = data => {
  return {
    type: actionTypes.DIGEST_BY_OPERATIONAL_STATUS_LOADED,
    payload: {
      labels: ["Fully Functional", "Partially Functional", "Non Functional"],
      datasets: [
        {
          label: "Operational Status",
          data: data,
          backgroundColor: [
            "rgba(255,105,145,0.6)",
            "rgba(155,100,210,0.6)",
            "rgba(90,178,255,0.6)"
          ]
        }
      ]
    }
  };
};

export const digestOperationalStatus = () => {
  return dispatch => {
    Promise.all([
      axios.get(
        prepareLink(
          "collections/3/count.json?operational_status=fully_functional"
        )
      ),
      axios.get(
        prepareLink(
          "collections/3/count.json?operational_status=partially_functional"
        )
      ),
      axios.get(
        prepareLink(
          "collections/3/count.json?operational_status=not_functional"
        )
      )
    ])
      .then(res => {
        const data = res.map(digest => digest.data);
        dispatch(loadDigestOperationalStatus(data));
      })

      .catch(err => console.log(err));
  };
};

const loadDigestOwnershipStatus = data => {
  return {
    type: actionTypes.DIGEST_BY_OWNERSHIP_STATUS_LOADED,
    payload: {
      labels: ["Government", "Private", "NGO"],
      datasets: [
        {
          label: "Ownership Status",
          data: data,
          backgroundColor: [
            "rgba(255,105,145,0.6)",
            "rgba(155,100,210,0.6)",
            "rgba(90,178,255,0.6)"
          ]
        }
      ]
    }
  };
};

export const digestOwnershipStatus = () => {
  return dispatch => {
    Promise.all([
      axios.get(prepareLink("collections/3/count.json?ownership[under]=gov")),
      axios.get(prepareLink("collections/3/count.json?ownership[under]=priv")),
      axios.get(prepareLink("collections/3/count.json?ownership[under]=ngo"))
    ])
      .then(res => {
        const data = res.map(digest => digest.data);
        dispatch(loadDigestOwnershipStatus(data));
      })

      .catch(err => console.log(err));
  };
};

const allChartsLoaded = charts => {
  return {
    type: actionTypes.LOAD_ALL_CHARTS,
    payload: {
      charts
    }
  };
};
export const loadAllCharts = setting => {
  return dispatch => {
    if (!setting.length > 0) return;
    // let layers_metadata = null;

    axios_restricted
      .get(prepareLink("collections/3/layers.json"))
      .then(res => {
        const chart_urls = [],
          chart_labels = [];
        const layers_metadata = res.data;
        // console.log(setting);
        //Loop setting and fields to the object:
        //field_type, code, name, id
        for (const chart_setting of setting) {
          //Get layer of field from the setting
          const layer_metadata = layers_metadata.find(layer => {
            return layer.id === chart_setting.layer_id && layer.fields;
          });
          //Get detailed field info
          const field_metadata = layer_metadata.fields.find(
            field => field.id === chart_setting.field_id
          );

          chart_setting.label = field_metadata.name;

          let field_url = [],
            chart_label = [];

          switch (field_metadata.kind) {
            case "select_many":
            case "select_one":
              field_url = field_metadata.config.options.map(option => {
                chart_label.push(option.label);
                return `${field_metadata.code}=${option.code}`;
              });
              break;
            case "hierarchy":
              const tree = [...field_metadata.config.hierarchy];
              while (tree.length) {
                const node = tree.shift();

                chart_label.push(node.name);
                field_url.push(`${field_metadata.code}[under]=${node.id}`);

                if (node.sub) {
                  tree.unshift(...node.sub);
                }
              }
              break;
            case "yes_no":
              chart_label.push(["Available", "Not available"]);

              field_url.push([
                `${field_metadata.code}=yes`,
                `${field_metadata.code}=no`
              ]);
              break;
            default:
              break;
          }

          //Push field chart urls and labels to
          //all field urls and labels arrays
          chart_urls.push(field_url);
          chart_labels.push(chart_label);
        }

        return { chart_urls, chart_labels };
      })
      .then(({ chart_urls, chart_labels }) => {
        // Fire up the request
        Promise.all(
          chart_urls.map(urls =>
            Promise.all(
              urls.map(url =>
                axios.get(prepareLink(`collections/3/count.json?${url}`))
              )
            )
          )
        )
          .then(res => {
            const chart_configs = res.map((chart, chart_index) => {
              const chart_config = {};
              const chart_data = chart.map(response => response.data);
              chart_config.labels = chart_labels[chart_index];
              chart_config.datasets = [
                {
                  label: setting[chart_index].label,
                  data: chart_data,
                  backgroundColor: [
                    "rgba(255,105,145,0.6)",
                    "rgba(155,100,210,0.6)",
                    "rgba(90,178,255,0.6)",
                    "rgba(240,134,67,0.6)",
                    "rgba(120,120,120,0.6)",
                    "rgba(250,55,197,0.6)"
                  ]
                }
              ];

              return {
                data: chart_config,
                height: 300,
                type: setting[chart_index].chart_type,
                options: {
                  title: {
                    display: setting[chart_index].label,
                    text: setting[chart_index].label,
                    fontSize: 25
                  },
                  legend: {
                    display: true,
                    position: "bottom"
                  }
                }
              };
            });
            dispatch(allChartsLoaded(chart_configs));
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        console.error(err);
      });
  };
};
