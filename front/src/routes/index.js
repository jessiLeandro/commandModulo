import React, { Component } from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import jwt from "jsonwebtoken";
import { promisify } from "util";

import LoginPage from "../Pages/Login";
import PrivateRoute from "./privateRoutes";

class Routes extends Component {
  state = {
    redirect: null,
  };

  componentDidMount = async () => {
    try {
      await promisify(jwt.verify)(this.props.login.token, "realponto#%real%");
      await this.setState({ redirect: "/logged" });
    } catch (error) {
      await this.setState({ redirect: "/login" });
    }
  };

  render() {
    return (
      <BrowserRouter>
        {this.state.redirect && <Redirect to={this.state.redirect} />}
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute path="/logged" />
        </Switch>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    login: state.login,
  };
}

export default connect(mapStateToProps)(Routes);
