import React, { Component } from "react";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import ContentRemove from "material-ui/svg-icons/content/remove";
import ReactTooltip from "react-tooltip";

import "./Recipe.css";
import PaperList from "../PaperList";
import StarRatingComponent from "react-star-rating-component";
import NutritionInfo from "./NutritionInfo";

const Recipe = ({
  recipe,
  user,
  addRecipeToUser,
  removeRecipeToUser,
  recipeBelongsToUser,
  onStarClick,
  initialRating,
  showRating
}) => (
  <div className="recipe-container">
    <h1>{recipe.name}</h1>
    <div id="recipe-wrapper">
      <p>
        From the kitchen of <a href={recipe.url}>{recipe.source}</a>
      </p>
      <img src={recipe.image} alt="recipe-image" width="200" />
      {showRating && (
        <div className="star-container">
          <StarRatingComponent
            name="star-rating"
            value={initialRating}
            starCount={5}
            editing={true}
            onStarClick={onStarClick}
          />
        </div>
      )}

      <div className="nutrition-btn-container">
        <NutritionInfo recipe={recipe} />
      </div>
      {user &&
        user._id && (
          <div className="floating-btn-container">
            <ReactTooltip place="left" type="dark" effect="float" />
            <FloatingActionButton
              mini={false}
              secondary={recipeBelongsToUser(user, recipe)}
              onClick={
                recipeBelongsToUser(user, recipe)
                  ? () => removeRecipeToUser(user, recipe)
                  : () => addRecipeToUser(user, recipe)
              }
            >
              {recipeBelongsToUser(user, recipe) ? (
                <ContentRemove data-tip="remove recipe" />
              ) : (
                <ContentAdd data-tip="add recipe" />
              )}
            </FloatingActionButton>
          </div>
        )}
    </div>

    <div className="notes-group">
      <PaperList title={"Ingredients"} data={recipe.ingredients} />
      <PaperList title={"Dietary Restrictions"} data={recipe.preferences} />
    </div>
  </div>
);

export default Recipe;
