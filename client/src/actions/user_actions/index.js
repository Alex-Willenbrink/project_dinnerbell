import userConstants from "../../constants/user_constants";
import AsyncManager from "../../services/AsyncManager";
// import {findOrCreateRecipe} from ".."

export function setUserLoading(bool) {
  return {
    type: userConstants.SET_USER_LOADING,
    payload: bool
  };
}

export function setCurrentUser(user) {
  return {
    type: userConstants.SET_CURRENT_USER,
    payload: user
  };
}

export function setUserError(error) {
  return {
    type: userConstants.SET_USER_ERROR,
    payload: error
  };
}

export const setUserStatus = bool => {
  return {
    type: userConstants.SET_USER_STATUS,
    payload: bool
  };
};

export const setUserImage = img => {
  return {
    type: userConstants.SET_USER_IMAGE,
    payload: img
  };
};

export const setUserRecipeImage = img => {
  return {
    type: userConstants.SET_USER_RECIPE_IMAGE,
    payload: img
  };
};

export const setAllUsers = users => {
  return {
    type: userConstants.SET_ALL_USERS,
    payload: users
  };
};

export const checkCurrentUser = () => async dispatch => {
  try {
    const payload = await AsyncManager.getRequest("/auth/current-user");
    if (payload && payload.errors) {
      throw new Error(payload.errors[0]);
    } else {
      dispatch(setCurrentUser(payload));
    }
  } catch (e) {
    dispatch(setUserError(e.message));
  }
};

export const registerUser = data => async dispatch => {
  try {
    dispatch(setUserLoading(true));
    const payload = await AsyncManager.postRequest("/auth/register", data);
    if (payload && payload.errors) {
      throw new Error(payload.errors[0]);
    } else {
      dispatch(setCurrentUser(payload));
    }
    dispatch(setUserLoading(false));
  } catch (e) {
    dispatch(setUserError(e.message));
  }
};

export const loginUser = data => async dispatch => {
  try {
    dispatch(setUserLoading(true));
    const payload = await AsyncManager.postRequest("/auth/login", data);
    if (payload && payload.errors) {
      throw new Error(payload.errors[0]);
    } else {
      dispatch(setCurrentUser(payload));
    }
    dispatch(setUserLoading(false));
  } catch (e) {
    dispatch(setUserError(e.message));
  }
};

export const logoutUser = data => async dispatch => {
  try {
    await AsyncManager.getRequest("/auth/logout");
    dispatch(setCurrentUser(null));
  } catch (e) {
    dispatch(setUserError(e.message));
  }
};

export const updateUser = userObj => async dispatch => {
  try {
    dispatch(setUserLoading(true));
    const payload = await AsyncManager.patchRequest(
      `/api/users/${userObj._id}`,
      userObj
    );
    if (payload && payload.errors) throw new Error(payload.errors[0]);
    if (payload && payload.error) throw new Error(payload.error);
    dispatch(setUserLoading(false));
    dispatch(setCurrentUser(payload));
  } catch (e) {
    dispatch(setUserError(e.message));
  }
};

export const setUserProfileImage = file => async dispatch => {
  try {
    const response = await AsyncManager.uploadFile("/api/users/picture", file);
    dispatch(setUserImage(response));
  } catch (e) {
    dispatch(setUserError(e.message));
  }
};

export const getUsers = () => async dispatch => {
  try {
    let users = await AsyncManager.getRequest("/api/users");
    dispatch(setAllUsers(users));
  } catch (err) {
    console.log(err);
  }
};
export const addRecipe = (userId, recipeId) => async dispatch => {
  try {
    await AsyncManager.patchRequest(`/api/users/${userId}/recipes/${recipeId}`);
  } catch (err) {
    console.error(err);
  }
};
