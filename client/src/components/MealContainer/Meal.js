import React from "react";
import UsersList from "../UsersContainer/UsersList";
import PaperList from "../PaperList";
import Paper from "material-ui/Paper";

const styles = {
  container: {
    background: "#3c8d41",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "25px",
    color: "white",
    fontFamily: "'Open Sans', sans-serif",
    width: "100%",
    height: "100%"
  },
  img: { width: "300px", borderRadius: "25px" },
  h3: {
    textAlign: "center",
    margin: 0,
    paddingTop: "10px",
    fontFamily: "'Open Sans', sans-serif",
    textDecoration: "underline"
  },
  h2: {
    fontSize: "1em",
    marginBottom: 50,
    marginTop: 10,
    fontFamily: "'Open Sans', sans-serif"
  },
  infoRow: {
    display: "flex",
    flexDirection: "row"
  },
  recipes: {
    borderRadius: "25px",
    paddingRight: "20px",
    paddingLeft: "20px",
    fontFamily: "Open Sans"
  }
};

// renders invitees that have accounts as user objects and that don't as strings
const Guests = ({ unregGuests, regGuests }) => (
  <div>
    {regGuests ? (
      <div>
        <UsersList users={regGuests} title="Attending" />
      </div>
    ) : null}
    {unregGuests.length ? (
      <div>
        <PaperList title="others attending" data={unregGuests} />
      </div>
    ) : null}
  </div>
);

const RecipesList = ({ recipes }) => (
  <div>
    <h3 style={styles.h3}>Recipes</h3>
    {recipes.length
      ? recipes.map(recipe => <p key={recipe._id}>{recipe.name}</p>)
      : null}
  </div>
);

const Meal = ({ meal }) => {
  // Conditional check to populate the guests that do and don't have accounts with
  // the site
  let regGuests = [];
  let unregGuests = [];
  if (meal.registeredGuests.length)
    regGuests = regGuests.concat(meal.registeredGuests);
  if (meal.unregisteredGuests.length)
    unregGuests = unregGuests.concat(meal.unregisteredGuests);

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: "3em" }}>{meal.name}</h1>

      <img
        src={meal.image || "https://imgur.com/gWYzeND.jpg"}
        alt="meal"
        style={styles.img}
      />
      <h2 style={styles.h2}>
        hosted by{" "}
        <span style={{ fontSize: "1.5em" }}>{meal.owner.username}</span>
      </h2>

      <div style={styles.infoRow}>
        <Guests regGuests={regGuests} unregGuests={unregGuests} />
        <PaperList title="Tasks" data={meal.tasks} />
        <Paper zDepth={4} style={styles.recipes}>
          <RecipesList recipes={meal.recipes} />
        </Paper>
      </div>
    </div>
  );
};

export default Meal;
