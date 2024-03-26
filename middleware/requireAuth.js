import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const requireAuth = async (err, req, res, next) => {
    // request headers Authorization
    const tokenWithBearer = req.headers.authorization;

    const token = tokenWithBearer.split(" ")[1]; // part of the sting after 'Bearer' and the empty string (split argument " ")

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired. Please log in again.' });
    }
    next(err);

    if (token) {
        const { _id } = jwt.verify(token, process.env.SECRET); 
        // Attaching the "user" property on the request object
        req.user = await UserModel.findOne({ _id }).select('_id');

        next();

    } else {
        return res.status(401).json({error: 'Request is not authorized!'});
    }
};
