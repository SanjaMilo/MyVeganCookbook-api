import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';


const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, {expiresIn: '7d'});
};

// Login user
export const loginUser = async (req, res) => {
    
    const {email, password} = req.body;
   
    try {
        // Validation
        if (!email || !password) {
            throw Error('All fields must be filled!');
        }
        //  get user
        const user = await UserModel.findOne({ email }); 

        if (!user) {
           throw Error('Incorrect email!');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw Error('Incorrect password!');
        }
        // Create a Token 
        const token = createToken(user._id);
        // send response
        //res.status(200).json({email, token}); // ??
        res.status(200).json({token, userID: user._id});

    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

// Signup user
export const signupUser = async (req, res) => {
    
    const {email, password} = req.body;
   
    try {
        // Validation
        if (!email || !password) {
            throw Error('All fields must be filled!');
        }
        if (!validator.isEmail(email)) {
            throw Error('Invalid email!');
        }
        if(!validator.isStrongPassword(password)) {
            throw Error('Password not strong enough!');
        }

        //  check if this user already exists in the database
        const userExist = await UserModel.findOne({ email }); 

        if (userExist) {
            throw Error('Email already in use!');
        }

        const salt = await bcrypt.genSalt(11); 
        const hash = await bcrypt.hash(password, salt);

        // Create a new user 
        const user = await UserModel.create({ email, password: hash });
        // Create a Token
        const token = createToken(user._id);
        // send response
        res.status(200).json({email, token, message: "New user registered successfully!"});

    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

