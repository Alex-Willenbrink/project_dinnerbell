import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import TextField from "material-ui/TextField";
import InputToken from "./InputTokenForm";
import FlatButton from "material-ui/FlatButton";

import * as userActions from "../../actions/user_actions";
import * as mealActions from "../../actions/meal_actions";

import Dropzone from "react-dropzone";
import ReactTooltip from "react-tooltip";
import swal from "sweetalert2";

import "./CreateMeal.css";
import "./InputTokenForm.css";

class CreateMeal extends Component {
  state = {
    value: 2,
    mealName: "",
    mealTasks: "",
    recipeTokens: [],
    selectedRecipes: [],
    recipeOptions: [],
    userTokens: [],
    selectedUsers: [],
    userOptions: [],
    isLoading: false
  };

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    this.props.userActions.getUsers();
  }

  componentDidUpdate() {
    const { userReducer } = this.props;
    if (userReducer.users && userReducer.user && this.state.isLoading) {
      let filtered = userReducer.users.filter(
        user => user.username !== userReducer.user.username
      );
      let recipes = userReducer.user.recipes || [];

      filtered.forEach((item, index) => {
        item.id = index;
        item.name = item.username;
        item.element = (
          <span>
            {item.username}
          </span>
        );
      });

      recipes.forEach((recipe, index) => {
        recipe.id = index;
        recipe.element = (
          <span>
            {recipe.name}
          </span>
        );
      });

      this.setState({
        userOptions: filtered,
        recipeOptions: recipes,
        isLoading: false
      });
    }
  }

  handleUsersKeyPress = e => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      let userOptions = [...this.state.userOptions];
      let userTokens = [...this.state.userTokens];

      this.setState({ userOptions, userTokens });
    }
  };

  handleRecipesKeyPress = e => {
    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  selectedUserToken = e => {
    let tokens = e.target.value;
    let selectedUsers = [];
    let copy = [...tokens];
    const userIndex = copy.pop();
    let result = this.state.userOptions.filter(x => x.id === userIndex);
    if (result.length) {
      selectedUsers = [...this.state.selectedUsers, result[0]._id];
    } else {
      selectedUsers.pop();
    }

    this.setState({ userTokens: tokens, selectedUsers });
  };

  selectRecipeToken = e => {
    let tokens = e.target.value;
    let selectedRecipes = [];
    let copy = [...tokens];
    const recipeIndex = copy.pop();
    let result = this.state.recipeOptions.filter(x => x.id === recipeIndex);

    if (result.length) {
      selectedRecipes = [...this.state.selectedRecipes, result[0]._id];
    } else {
      selectedRecipes.pop();
    }

    this.setState({ recipeTokens: tokens, selectedRecipes });
  };

  renderTextField = ({ input, label, meta: { touched, error }, ...custom }) =>
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />;

  onTextInputName = e => {
    this.setState({
      mealName: e.target.value
    });
  };

  onTextFieldInput = e => {
    this.setState({
      mealTasks: e.target.value
    });
  };

  onSubmitForm = e => {
    e.preventDefault();
    const { userReducer, mealReducer, mealActions } = this.props;
    const { mealName, selectedRecipes, selectedUsers, mealTasks } = this.state;

    if (
      !mealName.length ||
      !selectedRecipes.length ||
      !selectedUsers.length ||
      !mealTasks.length
    ) {
      swal("Incomplete!", "You need to fill out all the fields!", "error");

      return;
    }

    const data = {
      name: mealName,
      date: new Date(Date.now()),
      owner: userReducer.user && userReducer.user._id,
      recipes: selectedRecipes,
      registeredGuests: selectedUsers,
      tasks: mealTasks,
      image: mealReducer.mealPicture
    };

    mealActions.createMeal(data).then(() => {
      swal({
        title: "Meal created!",
        text: "Time to break out those cooking skills!",
        timer: 2000,
        onOpen: function() {
          swal.showLoading();
        }
      }).then(
        () => {},
        // handling the promise rejection
        dismiss => {
          if (dismiss === "timer") {
            this.props.history.push(`/profile/${userReducer.user._id}`);
            console.log("I was closed by the timer");
          }
        }
      );
    });
  };

  imageSelected = files => {
    const image = files[0];

    this.props.mealActions.setMealProfileImage(image);
  };

  render() {
    const { mealReducer, userReducer } = this.props;
    console.log(userReducer, "user reducer");
    console.log(this.state, "state");
    return (
      <div className="create-recipe">
        <ReactTooltip
          place="top"
          type="dark"
          effect="float"
          className="recipe-btn-tooltip"
        />
        <form onSubmit={this.onSubmitForm}>
          <p className="label">Plan out your meal</p>
          {!mealReducer.mealPicture
            ? <div
                className="user-recipe-img-default"
                style={{ margin: "0 auto" }}
              />
            : <div
                className="user-recipe-img-custom"
                style={{ margin: "0 auto" }}
              >
                <img src={mealReducer.mealPicture} alt="meal-img" />
              </div>}
          <div className="recipe-form-body">
            <div className="recipe-name-ingredient-container">
              <div
                style={{
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <TextField
                  name="name"
                  hintText={"meal name"}
                  floatingLabelText={"give your meal a name"}
                  floatingLabelStyle={{ color: "white" }}
                  hintStyle={{ color: "white" }}
                  inputStyle={{ color: "white" }}
                  autoComplete="off"
                  onChange={this.onTextInputName}
                />
                <Dropzone
                  onDrop={this.imageSelected}
                  style={{ border: "none" }}
                >
                  <i
                    className="fa fa-camera"
                    aria-hidden="true"
                    data-tip="Add a picture to represent your meal!"
                  />
                </Dropzone>
              </div>

              <InputToken
                name="Recipes"
                isLoading={this.state.isLoading}
                value={this.state.recipeTokens}
                placeholder="pick recipes"
                options={this.state.recipeOptions}
                onSelect={this.selectRecipeToken}
                onKeyPress={this.handleRecipesKeyPress}
                errorType="recipe"
                color="blue"
              />

              <InputToken
                name="Guests"
                isLoading={this.state.isLoading}
                value={this.state.userTokens}
                placeholder="choose guests"
                options={this.state.userOptions}
                onSelect={this.selectedUserToken}
                onKeyPress={this.handleUsersKeyPress}
                errorType="guests"
                color="orange"
              />
            </div>

            <div className="wrapper">
              <div className="paper">
                <textarea
                  placeholder="List out the preparation tasks for this meal :)"
                  className="text"
                  name="instructions"
                  rows="4"
                  style={{
                    overflow: "hidden",
                    wordWrap: "break-word",
                    resize: "none",
                    height: "500px",
                    width: "700px"
                  }}
                  onChange={this.onTextFieldInput}
                />
                <br />
              </div>
            </div>
          </div>

          <div className="recipe-login-buttons">
            <button type="submit">submit</button>
            <button onClick={this.props.history.goBack}>cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActions, dispatch),
  mealActions: bindActionCreators(mealActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateMeal)
);
