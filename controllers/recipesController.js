import RecipeModel from "../models/recipeModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";


// 1. GET all recipes (path: '/api/recipes/')
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. GET a single recipe by its ID (path: '/api/recipes/id') - Recipe's details
export const getSingleRecipe = async (req, res) => {
  const { id } = req.params;
  // Mongoose object ID must be a string of 12 bytes or 24 hex characters or an integer. So we need this check:
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid Recipe Id!" });
  }

  const recipe = await RecipeModel.findById(id);

  if (!recipe) {
    return res.status(404).json({ error: "No such recipe!" });
  }
  res.status(200).json(recipe);
};

// TODO: Protect this route (only for authorized user)
// 3. POST Create a new recipe (path: '/api/recipes/')
export const createRecipe = async (req, res) => {
  try {
    // TODO: Add the authorized user
    const recipe = await RecipeModel.create({ ...req.body });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// TODO: Protect this route (only for authorized user)
// 4. PUT Save a recipe
export const saveRecipe = async (req, res) => {
  const { userID, recipeID } = req.body;

  try {
    // The recipe that the user whats to save
    const recipe = await RecipeModel.findById(recipeID);
    // The user who wants to save the recipe
    const user = await UserModel.findById(userID);

    // Then we want to save the recipe's "_id" into the users array of saved-recipes
    user.savedRecipes.push(recipe._id);
    // Save it to the "users" collection in the Database
    await user.save();

    // send response the array of saved recipes
    res.status(200).json({ savedRecipes: user.savedRecipes, savedRecipe: recipe });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

// 5. GET all saved recipes IDs list (all the IDs of the recipes that one user have saved)
export const savedRecipesIdsList = async (req, res) => {
  const { userID } = req.params;

  try {
    // get the user (by his Id) who's saved recipes list we want
    const user = await UserModel.findById(userID);

    // we send the list od saved recipes by that user
    res.status(200).json({ savedRecipes: user?.savedRecipes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 6. GET all saved recipes by user
export const allSavedRecipes = async (req, res) => {
  const { userID } = req.params;

  try {
    // get the user (by his Id) who's saved-recipes-list we want
    const user = await UserModel.findById(userID);
    // get every recipe which id is found in the array of saved recipes by that user
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    // send response - the saved recipes
    res.status(200).json(savedRecipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 7. DELETE - Remove (un-save) saved recipe id from the saved-recipes-ids list
export const removeSavedRecipeFromList = async (req, res) => {
  const { userID } = req.params;
  const { recipeID } = req.params;

  try {
    // get the user (by his Id) who's saved recipes list we want
    const user = await UserModel.findById(userID);
    const recipe = await RecipeModel.findById(recipeID)

    const removedSavedRecipeId = user?.savedRecipes.find(id => id.equals(recipeID));

    user?.savedRecipes.pull(recipeID);
    await user.save();
    // send response the un-saved recipe
    res.status(200).json({ savedRecipes: user.savedRecipes, removedRecipeId: removedSavedRecipeId, removedRecipeTitle: recipe.title});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 8. POST - Search Recipes by its "title"
export const searchRecipe = async (req, res) => {
  const searchKeyword = req.body.payload.trim();

  try {
    const searchedRecipes = await RecipeModel.find({
      title: { $regex: searchKeyword, $options: "i" },
    });

    res.status(200).json(searchedRecipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
