import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDBConnected } from '../config/db.js';
import persistentDB from '../services/persistentDB.js';

/**
 * Protect routes by validating JWT Bearer token in Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_habit_planner_development_2026'
      );

      if (isDBConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          res.status(401);
          throw new Error('User not found or account deactivated');
        }
      } else {
        // Fetch the exact authenticated user from persistentDB
        const user = persistentDB.getUserById(decoded.id);
        if (!user) {
          res.status(401);
          throw new Error('User not found or session expired');
        }
        req.user = user;
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token validation failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};

export default protect;
