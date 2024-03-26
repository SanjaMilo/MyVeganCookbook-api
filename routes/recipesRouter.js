import express from 'express';
import { 
    getAllRecipes, 
    getSingleRecipe, 
    createRecipe,
    saveRecipe,
    searchRecipe,
    savedRecipesIdsList,
    allSavedRecipes,
    removeSavedRecipeFromList
} from '../controllers/recipesController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Add Routes to the Router: 

// 1. GET all recipes (path: '/api/recipes/')
router.get('/', getAllRecipes);

// 2. GET a single recipe by its ID (path: '/api/recipes/id')
router.get('/:id', getSingleRecipe);

// 3. POST Create a new recipe (path: '/api/recipes/'). *** Protected - only authorized user
router.post('/', requireAuth, createRecipe);

// 4. PUT Save a recipe (path: '/api/recipes/'). *** Protected - only authorized user
router.put('/', requireAuth, saveRecipe); 

// 5. GET list of saved recipes IDs by user (path: '/api/recipes/savedrecipes/ids/:userID')
router.get('/savedrecipes/ids/:userID', requireAuth, savedRecipesIdsList);

// 6. GET All saved recipes by user (path: '/api/recipes//savedrecipes/:userID')
router.get('/savedrecipes/:userID', requireAuth, allSavedRecipes);

// TODO: Remove (Delete) recipe id from the list and Un-Save a recipe (from the Save Recipes Page)
// 7. DELETE UN-SAVE recipe by removing it from the user's list of saved recipes ids
router.put('/savedrecipes/ids/:userID&:recipeID', requireAuth, removeSavedRecipeFromList);

// 8. POST - Search Recipes by "title" property
router.post('/search', searchRecipe);



// PUT (update), SAVE a recipe (a saved recipe by its ID is saved in the 'users" collection in the savedRecipes property - array of saved recipes)


export { router as recipesRouter };