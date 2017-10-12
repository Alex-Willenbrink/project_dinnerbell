import React from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle, CardMedia } from "material-ui";
import StarRatingComponent from "react-star-rating-component";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import ContentRemove from "material-ui/svg-icons/content/remove";
import ReactTooltip from "react-tooltip";

import "./RecipeCard.css";

const findAvgRating = recipe => {
  if (recipe.ratings.length < 1) return 0;
  const ratingsSum = recipe.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  return Math.floor(ratingsSum / recipe.ratings.length);
};

const findRecipeName = recipe => {
  return recipe.name.length > 40
    ? `${recipe.name.slice(0, 37)}...`
    : recipe.name;
};

const RecipeCard = ({
  recipe,
  user,
  addRecipeToUser,
  removeRecipeToUser,
  recipeBelongsToUser,
  index
}) => {
  return (
    <Card className={`recipe-card delay-${index}`}>
      <Link to={`/recipes/${recipe._id}`}>
        <CardMedia>
          <img src={recipe.image} alt="" />
        </CardMedia>
        <CardTitle className="card-title">
          {findRecipeName(recipe)}
        </CardTitle>
        <article className="ratings-container">
          <StarRatingComponent
            name="star-rating"
            value={findAvgRating(recipe)}
            starCount={5}
            editing={false}
            className="star-ratings"
          />
          <p className="ratings-length">
            (rated by {recipe.ratings.length} users)
          </p>
        </article>
      </Link>
      <ReactTooltip
          place="left"
          type="dark"
          effect="float"
          className="recipe-btn-tooltip"
        />
      {user && user._id
        && <FloatingActionButton
            data-tip={
              recipeBelongsToUser(user, recipe) ? "remove recipe" : "add recipe"
            }
            className="add-button"
            mini={true}
            secondary={recipeBelongsToUser(user, recipe)}
            onClick={
              recipeBelongsToUser(user, recipe)
                ? () => removeRecipeToUser(user, recipe)
                : () => addRecipeToUser(user, recipe)
            }
          >
            {recipeBelongsToUser(user, recipe)
              ? <ContentRemove />
              : <ContentAdd />}
          </FloatingActionButton>}
    </Card>
  );
};

export default RecipeCard;
