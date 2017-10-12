import React, { Component } from "react";
import { Paper } from "material-ui";
import { withRouter } from "react-router-dom";
import * as userActions from "../../actions/user_actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./Landing.css";

const style = {
  height: 100,
  width: 100
};

class Landing extends Component {
  state = {
    finishedLoading: false
  };
  componentDidMount() {
    this.props.userActions.checkCurrentUser().then(() => {
      this.setState({ finishedLoading: true });
    });
  }

  render() {
    const buttonOptions = (this.state.finishedLoading && !this.props
      .userReducer.user) ? (
      <div className="landing-auth-container">
        <button
          onClick={() => {
            this.props.history.push("/register");
          }}
        >
          register
        </button>
        <button
          onClick={() => {
            this.props.history.push("/login");
          }}
        >
          login
        </button>
      </div>
    ) : (
      <div
        className="landing-auth-container"
        style={{ justifyContent: "center" }}
      >
        <button onClick={() => this.props.userActions.logoutUser()}>
          logout
        </button>
      </div>
    );

    const authOptions =
      !this.props.userReducer.user  && this.state.finishedLoading && (
        <div className="oauth-landing">
          <a href="/auth/facebook">
            <img src="https://imgur.com/Hw9YUrJ.png" alt="" />
          </a>
          <a href="/auth/google">
            <img src="https://i.imgur.com/ETp8DOT.png" alt="" />
          </a>
        </div>
      );

    return (
      <section className="landing">
        <h1 className="landing-title">dinnerbell</h1>
        <p className="landing-description">
          <span>cook ~ eat ~ enjoy</span>
        </p>
        {buttonOptions}

        <div className="landing-img-cube">
          <div className="landing-images ">
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-1" />
            </Paper>
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-2" />
            </Paper>
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-3" />
            </Paper>
          </div>
          <div className="landing-images">
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-4" />
            </Paper>
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-5" />
            </Paper>
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-6" />
            </Paper>
          </div>
          <div className="landing-images">
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-7" />
            </Paper>
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-8" />
            </Paper>
            <Paper style={style} zDepth={2}>
              <div className="landing-img-container-9" />
            </Paper>
          </div>
          {authOptions}
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Landing)
);
