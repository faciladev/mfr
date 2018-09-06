import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import "./index.scss";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import facilityListingReducer from "./store/reducers/facilityListing";
import adminHierarchiesReducer from "./store/reducers/adminHierarchies";
import chartReducer from "./store/reducers/charts";
import apiUser from "./store/reducers/apiUser";

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

const rootReducer = combineReducers({
  apiUser,
  facilityListingReducer,
  adminHierarchiesReducer,
  chartReducer
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
