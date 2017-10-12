import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import TextField from "material-ui/TextField";
import asyncValidate from "../../services/AsyncValidate";
import CircularProgress from "material-ui/CircularProgress";
import { withRouter } from "react-router-dom";
import swal from "sweetalert2";

import "./SignupForm.css";

const validate = values => {
  const errors = {};
  const requiredFields = ["email", "password"];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }
  const passwordLength = 6;
  if (values.password && values.password.length < passwordLength) {
    errors.password = `Password must be at least ${passwordLength} characters`;
  }
  return errors;
};

class SignupForm extends Component {
  onSubmit = () => {
    const { registerUser, formData, setUserError } = this.props;
    const { email, password } = formData.SignupForm.values;

    registerUser({
      email,
      password
    }).then(() => {
      if (this.props.userReducer.userError) {
        swal("Oops...", "Something went wrong! Please try again.", "error");
        setUserError(null);
      } else {
        swal({
          title: "Success!",
          text: "You are registered!",
          timer: 2000,
          onOpen: function() {
            swal.showLoading();
          }
        }).catch(swal.noop);
      }
    });
  };

  renderTextField = ({ input, label, meta: { touched, error }, ...custom }) =>
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />;

  render() {
    const {
      handleSubmit,
      pristine,
      reset,
      submitting,
      userLoading,
      userReducer
    } = this.props;

    const authOptions = !userReducer.user
      ? <div className="oauth">
          <a href="/auth/facebook">
            <img src="https://imgur.com/Hw9YUrJ.png" alt="" />
          </a>
          <a href="/auth/google">
            <img src="https://i.imgur.com/ETp8DOT.png" alt="" />
          </a>
        </div>
      : null;

    if (userLoading && !this.props.userReducer.userError) {
      return (
        <div>
          <CircularProgress size={80} thickness={3} color="#fc5830" />
        </div>
      );
    }

    return (
      <div>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <h3 className="label">register</h3>
          <div>
            <Field
              autoComplete="off"
              className="material-field"
              name="email"
              component={this.renderTextField}
              label="email"
              required="required"
            />
          </div>
          <div>
            <Field
              autoComplete="off"
              className="material-field"
              name="password"
              type="password"
              component={this.renderTextField}
              label="password"
              required="required"
            />
          </div>

          <div className="signup-buttons">
            <button type="submit" disabled={pristine || submitting}>
              signup
            </button>
            <button
              onClick={() => {
                this.props.history.push("/");
              }}
            >
              back
            </button>
            <button
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
            >
              clear
            </button>
          </div>
        </form>
        {authOptions}
      </div>
    );
  }
}

export default reduxForm({
  form: "SignupForm",
  validate,
  asyncValidate
})(withRouter(SignupForm));
