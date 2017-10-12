import React, { Component } from "react";
import SignupForm from "../SignupForm";
import LoginForm from "../LoginForm";
import * as userActions from "../../actions/user_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import "./Authentication.css";

import _ from "lodash";

class Authentication extends Component {
  componentDidMount() {
    this.props.userActions.checkCurrentUser();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.userReducer.user, this.props.userReducer.user)) {
      this.props.history.push("/recipes");
    }
  }

  render() {
    return (
      <div className="authentication">
        {!this.props.showLogin
          ? <SignupForm
              registerUser={this.props.userActions.registerUser}
              setUserError={this.props.userActions.setUserError}
              userLoading={this.props.userReducer.userLoading}
              formData={this.props.form}
              userReducer={this.props.userReducer}
            />
          : <LoginForm
              loginUser={this.props.userActions.loginUser}
              setUserError={this.props.userActions.setUserError}
              userLoading={this.props.userReducer.userLoading}
              formData={this.props.form}
              userReducer={this.props.userReducer}
            />}
      </div>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Authentication)
);
