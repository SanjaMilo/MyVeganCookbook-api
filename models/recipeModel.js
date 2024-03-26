import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ingredients: [{
        type: String,
        required: true,
    }],
    instructions: {
        type: String,
        required: true,
    },
    cookingTime: {
        type: Number,
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true,
    }],
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    }
}, {
    timestamps: true
});

const RecipeModel = mongoose.model('recipe', RecipeSchema);

export default RecipeModel;