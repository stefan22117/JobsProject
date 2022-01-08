import React, { Component } from "react";
import { Route } from "react-router";
import { Provider } from "react-redux";
import store from "./redux/store";

import "./custom.css";
import SingleJob from "./components/SingleJob";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProvider from "./components/UserProvider";
import PostJob from "./components/PostJob";
import Freelancers from "./components/Freelancers";
import SingleFreelancer from "./components/SingleFreelancer";
import Profile from "./components/Profile";
import Inbox from "./components/Inbox";
import VerifyEmail from "./components/VerifyEmail";
import JobList from "./components/JobList";
import FreelancerPayment from "./components/FreelancerPayment";
import Withdraw from "./components/Withdraw";
import Charge from "./components/Charge";
import AdminCharges from "./components/AdminCharges";
import Navbar from "./components/Navbar";
import { Container } from "@material-ui/core";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Provider store={store}>
        <UserProvider>
          <Navbar />
          <Container>
            <Route
              exact
              path={["/", "/bidded-jobs", "/posted-jobs", "/finished-jobs"]}
              component={JobList}
            />

            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/jobs/:id" component={SingleJob} />
            <Route path="/post-job" component={PostJob} />
            <Route path="/edit-job/:id" component={PostJob} />
            <Route exact path="/freelancers" component={Freelancers} />
            <Route exact path="/verifyEmail/:token" component={VerifyEmail} />
            <Route exact path="/freelancers/:id" component={SingleFreelancer} />
            <Route
              exact
              path="/freelancers/payment/:id"
              component={FreelancerPayment}
            />
            <Route path="/profile" component={Profile} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/charge" component={Charge} />
            <Route path="/inbox" component={Inbox} />
            <Route exact path="/admin/charges" component={AdminCharges} />
          </Container>
        </UserProvider>
      </Provider>
    );
  }
}
