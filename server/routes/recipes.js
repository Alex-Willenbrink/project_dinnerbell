const router = require("express").Router();
const fetch = require("isomorphic-fetch");
const Recipe = require("../models/Recipe");
const {
  buildRecipePrefs,
  buildRecipeURL,
  sanitizeRecipes,
  sanitizeRecipe,
  buildDbQuery
} = require("../util/recipes");
const wrapper = require("../util/errorWrappers").expressWrapper;

// Route Handlers
const getRecipes = async (req, res) => {
  let { q, preferences } = req.query;
  preferences = preferences ? preferences : "";
  q = q ? q.toLowerCase() : "";

  const queryOpts = buildDbQuery(q, preferences);
  let recipes = await Recipe.find(queryOpts);

  if (recipes.length < 30) {
    const queryPrefs = buildRecipePrefs(preferences);
    const apiResponse = await fetch(buildRecipeURL([`q=${q}`, ...queryPrefs]));
    const apiRecipes = sanitizeRecipes(await apiResponse.json());

    const dbIdSet = recipes.reduce((acc, r) => acc.add(r.edamamId), new Set());
    const newRecipes = apiRecipes.filter(r => !dbIdSet.has(r.edamamId));
    await Promise.all(newRecipes.map(r => Recipe.sparseCreate(r)));
    recipes = await Recipe.find(queryOpts);
  }

  res.json(recipes);
  // res.json(dbResponse);
};

const newRecipe = async (req, res) => {
  const recipe = await Recipe.sparseCreate(req.body);
  res.json(recipe);
};

const findOrCreateRecipe = async (req, res) => {
  let recipe;
  recipe = await Recipe.findOne({ edamamId: req.body.edamamId });
  if (!recipe) {
    recipe = await Recipe.sparseCreate(req.body);
  }
  res.json(recipe);
};

const getRecipe = async (req, res) => {
  const edamamId = req.params.id;
  let recipe = await Recipe.findOne({ edamamId });
  if (!recipe) {
    const base = `http://www.edamam.com/ontologies/edamam.owl%23recipe_`;
    const response = await fetch(buildRecipeURL([`r=${base + edamamId}`]));
    const json = await response.json();
    if (json) {
      recipe = sanitizeRecipe({ recipe: json[0] });
      await Recipe.sparseCreate(recipe);
    }
  }
  res.json(recipe);
};

const updateRecipe = async (req, res) => {
  const recipe = await Recipe.sparseUpdate(req.params.id, req.body);
  res.json(recipe);
};

const removeRecipe = async (req, res) => {
  const recipe = await Recipe.remove({ _id: req.params.id });
  res.json(recipe);
};

// Register Route Handlers
router.get("/", wrapper(getRecipes));
// router.post("/", wrapper(newRecipe));
router.post("/", wrapper(findOrCreateRecipe));
router.get("/:id", wrapper(getRecipe));
router.patch("/:id", wrapper(updateRecipe));
router.delete("/:id", wrapper(removeRecipe));

module.exports = router;
