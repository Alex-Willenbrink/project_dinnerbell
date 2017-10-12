import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter, Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import FlatButton from "material-ui/FlatButton";
import _ from "lodash";

import "./Profile.css";
import * as userActions from "../../actions/user_actions";
import PreferenceSetter from "../PreferenceSetter";
import AsyncManager from "../../services/AsyncManager.js";
import UserLogContainer from "../UserLogContainer";
import LoadingFork from "../LoadingFork";

class Profile extends Component {
  state = {};

  allowedActions = () => {
    const local = this.state;
    const current = this.props.userReducer;
    if (local && current.user && local._id === current.user._id) {
      return this.props.userActions;
    }
  };

  imageSelected = async files => {
    const actions = this.allowedActions();
    if (actions) actions.setUserProfileImage(files[0]);
  };

  updateArray = field => async newData => {
    const actions = this.allowedActions();
    if (actions) actions.updateUser({ ...this.state, [field]: newData });
  };

  fetchUser = async id => {
    this.setState(await AsyncManager.getRequest(`/api/users/${id}`));
  };

  componentDidMount() {
    const user = this.props.userReducer.user;
    let id = this.props.match.params._id;
    id = id ? id : user._id;
    if (id) this.fetchUser(id);
  }

  componentWillReceiveProps(nextProps) {
    const current = this.props.match.params._id;
    const next = nextProps.match.params._id;
    if (next && next !== current) this.fetchUser(next);

    const nextUser = nextProps.userReducer.user;
    if (
      !!this.allowedActions() &&
      nextUser &&
      !_.isEqual(nextUser, this.state)
    ) {
      this.setState(nextUser);
    }
  }

  render() {
    if (!this.state._id) {
      return (
        <div className="recipe-results">
          <LoadingFork />
        </div>
      );
    }

    const { userReducer } = this.props;
    const { recipes = [], meals = [], registeredMeals = [] } = this.state;
    const allowed = this.allowedActions();

    const pic = !this.state.profilePicture
      ? "profile-pic-default"
      : "profile-pic-custom";

    const theirPic = (
      <div className={pic}>
        <img src={this.state.profilePicture} alt="" />
      </div>
    );

    const myPic = (
      <Dropzone onDrop={this.imageSelected} style={{ border: "none" }}>
        <div className="clickable-profile-pic">{theirPic}</div>
      </Dropzone>
    );

    return (
      <div className="profile">
        <p className="profile-name">{this.state.username}</p>
        {allowed ? myPic : theirPic}
        <div className="user-profile">
          <PreferenceSetter
            allowedActions={this.allowedActions()}
            user={this.state}
          />
        </div>

        <div className="user-logs-container">
          <UserLogContainer
            title="Your Recipes"
            resource="recipes"
            items={recipes}
            updateArray={this.updateArray("recipes")}
          />
          <UserLogContainer
            title="Your Meals"
            resource="meals"
            items={meals}
            updateArray={this.updateArray("meals")}
          />
          <UserLogContainer
            title="Invited Meals"
            resource="meals"
            items={registeredMeals}
            updateArray={this.updateArray("registeredMeals")}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
