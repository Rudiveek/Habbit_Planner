import jwt from 'jsonwebtoken';

/**
 * Generate a signed JSON Web Token
 * @param {string} userId - The MongoDB ObjectId of the user
 * @returns {string} - Signed JWT string
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_jwt_key_habit_planner_development_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

export default generateToken;
