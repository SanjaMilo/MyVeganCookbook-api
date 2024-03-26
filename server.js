import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { recipesRouter } from './routes/recipesRouter.js';
import { usersRouter } from './routes/usersRouter.js';

// instance of express
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "https://myvegancookbook.onrender.com"
}));
// logging middleware
if (environment === 'development') {
    app.use(morgan('dev'));
}

// Routes / Router recipes
app.use('/api/recipes', recipesRouter);
// Routes / Router user
app.use('/api/user', usersRouter);


// Connect to MongoDB database and after connecting to the database, start listening for requests
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests (after connecting to Database)
        app.listen(process.env.PORT, () => {
            console.log(`Server started in ${environment} mode. Connected to DB and listening on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));



