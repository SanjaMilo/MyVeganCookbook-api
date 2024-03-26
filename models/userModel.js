import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Array of saved recipes by user
    savedRecipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipes"
        }
    ]
});

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;



