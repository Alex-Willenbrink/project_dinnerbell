import recipeConstants from "../../constants/recipe_constants";
import AsyncManager from "../../services/AsyncManager";

const BASE_URL = "http://localhost:3001/api";

// export const forkRecipe = recipe => {
//   const response = postRequest(`${BASE_URL}/`);
// };

export const setRecipeLoading = bool => {
  return {
    type: recipeConstants.SET_RECIPE_LOADING,
    payload: bool
  };
};

export const successFindOrCreateRecipe = recipe => {
  return {
    type: recipeConstants.SUCCESS_FIND_OR_CREATE_RECIPE,
    payload: recipe
  };
};

export const findOrCreateRecipe = recipe => async dispatch => {
  try {
    dispatch(setRecipeLoading(true));
    const payload = await AsyncManager.postRequest(`/api/recipes`, recipe);
    dispatch(successFindOrCreateRecipe(payload));
    dispatch(setRecipeLoading(false));
  } catch (error) {
    // error checking is for chumps
  }
};
