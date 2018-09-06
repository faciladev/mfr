import * as actionTypes from "./actionTypes";
import axios from "../../axios-resmap";
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
        "Office",
        "Dentist"
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
        prepareLink("collections/20/count.json?facility_type[under]=Hospital")
      ),
      axios.get(
        prepareLink("collections/20/count.json?facility_type[under]=Clinic")
      ),
      axios.get(
        prepareLink(
          "collections/20/count.json?facility_type[under]=Health_Center"
        )
      ),
      axios.get(
        prepareLink(
          "collections/20/count.json?facility_type[under]=Health_Post"
        )
      ),
      axios.get(
        prepareLink("collections/20/count.json?facility_type[under]=Lab")
      ),
      axios.get(
        prepareLink("collections/20/count.json?facility_type[under]=Office")
      ),
      axios.get(
        prepareLink("collections/20/count.json?facility_type[under]=Dentist")
      )
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
          "collections/20/count.json?operational_status=fully_functional"
        )
      ),
      axios.get(
        prepareLink(
          "collections/20/count.json?operational_status=partially_functional"
        )
      ),
      axios.get(
        prepareLink(
          "collections/20/count.json?operational_status=not_functional"
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
      axios.get(prepareLink("collections/20/count.json?ownership[under]=gov")),
      axios.get(prepareLink("collections/20/count.json?ownership[under]=priv")),
      axios.get(prepareLink("collections/20/count.json?ownership[under]=ngo"))
    ])
      .then(res => {
        const data = res.map(digest => digest.data);
        dispatch(loadDigestOwnershipStatus(data));
      })

      .catch(err => console.log(err));
  };
};
