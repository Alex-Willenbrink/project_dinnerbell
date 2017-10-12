import React, { Component } from "react";

import SvgIcon from "material-ui/SvgIcon";
import FloatingActionButton from "material-ui/FloatingActionButton";
import IconButton from "material-ui/IconButton";

import * as userActions from "../../actions/user_actions";
import * as recipesActions from "../../actions/recipes_actions";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter, Link } from "react-router-dom";
import "./Navbar.css";

import queryString from "query-string";

const iconStyles = {
  marginLeft: "80px"
};

const ROUTE_MAP = {
  login: (
    <Link to="/login" className="non-logo-item" key="login">
      login
    </Link>
  ),
  register: (
    <Link to="/register" className="non-logo-item" key="register">
      register
    </Link>
  ),
  createMeal: (
    <Link to="/create_meal" className="non-logo-item" key="meal">
      create meal
    </Link>
  )
};

const Searchbar = ({ onSearchInputSubmit, onSearchInputChange }) => {
  return (
    <form action="" method="get" onSubmit={onSearchInputSubmit}>
      <input
        className="namanyay-search-box"
        name="q"
        size="40"
        type="text"
        placeholder="Search for recipes"
        onChange={onSearchInputChange}
      />
      <button
        className="namanyay-search-btn"
        type="submit"
        onClick={onSearchInputSubmit}
      >
        <i className="fa fa-search" aria-hidden="true" />
      </button>
    </form>
  );
};

class Navbar extends Component {
  state = {
    query: ""
  };

  componentDidMount() {
    this.props.userActions.checkCurrentUser();
  }

  onClickLogout = async () => {
    await this.props.userActions.logoutUser();
    this.props.history.push("/");
  };

  onSearchInputChange = e => {
    this.setState({
      query: e.target.value
    });
  };

  onSearchInputSubmit = e => {
    e.preventDefault();
    let preferencesString = "";
    if (this.props.location.pathname === "/recipes") {
      let { preferences } = this.parseSearchParams(this.props.location.search);
      preferencesString = preferences.join(",");
    } else {
      preferencesString =
        this.props.userReducer.user &&
        this.props.userReducer.user.dietaryRestrictions
          ? this.props.userReducer.user.dietaryRestrictions.join(",")
          : "";
    }
    this.props.history.push(
      `/recipes?q=${this.state.query}&preferences=${preferencesString}`
    );
  };

  parseSearchParams = url => {
    let { q, preferences } = queryString.parse(url);
    q = q ? q : "";
    preferences = preferences ? preferences : [];
    if (!Array.isArray(preferences)) {
      preferences = preferences.split(",");
    }
    return { q, preferences };
  };

  render() {
    let navItems = [];

    switch (this.props.location.pathname) {
      case "/login":
        navItems.push(ROUTE_MAP.register);
        break;

      case "/register":
        navItems.push(ROUTE_MAP.login);
        break;

      case "/create_meal":
        const showProfile =
          this.props.userReducer.user &&
          <Link
            to={`/profile/${this.props.userReducer.user._id}`}
            className="non-logo-item"
            key="profile"
          >
            profile
          </Link>;
        navItems.push(
          showProfile,
          <a
            onClick={this.onClickLogout}
            className="non-logo-item"
            key="logout"
          >
            logout
          </a>
        );
        break;
      default:
        if (this.props.userReducer.user) {
          navItems.push(
            <Link
              to={`/profile/${this.props.userReducer.user._id}`}
              className="non-logo-item"
              key="profile"
            >
              profile
            </Link>,
            <Link to={"/users"} className="non-logo-item" key="users">
              users
            </Link>,
            ROUTE_MAP.createMeal,
            <a
              onClick={this.onClickLogout}
              className="non-logo-item"
              key="logout"
            >
              logout
            </a>
          );
        } else {
          navItems.push(ROUTE_MAP.login, ROUTE_MAP.register);
        }
        break;
    }

    return (
      <div className="nav">
        <div className="nav-items">
          <Link to="/">
            <div className="logo" />
          </Link>
          {navItems}
        </div>
        <div className="nav-searchbar">
          <Searchbar
            onSearchInputChange={this.onSearchInputChange}
            onSearchInputSubmit={this.onSearchInputSubmit}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  recipesActions: bindActionCreators(recipesActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
