import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";
import Home from "./containers/Home/Home";
import SearchFacility from "./containers/SearchFacility/SearchFacility";
import Digest from "./containers/Digest/Digest";
import Geolocator from "./containers/Geolocator/Geolocator";
import Api from "./containers/Api/Api";
import Faq from "./containers/Faq/Faq";
import Contact from "./containers/Contact/Contact";

class App extends Component {
  render() {
    const routes = (
      <Switch>
        <Route path="/search" component={SearchFacility} />
        <Route path="/digest" component={Digest} />
        <Route path="/geolocator" component={Geolocator} />
        <Route path="/apidocs" component={Api} />
        <Route path="/faq" component={Faq} />
        <Route path="/contact" component={Contact} />
        <Route path="/" exact component={Home} />
      </Switch>
    );
    return <Layout>{routes}</Layout>;
  }
}

export default App;
