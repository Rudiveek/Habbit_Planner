import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { isDBConnected } from '../config/db.js';
import persistentDB from '../services/persistentDB.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid email address (e.g. name@example.com)');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters long');
    }

    // Persistent JSON database mode when MongoDB is not running locally
    if (!isDBConnected()) {
      const user = await persistentDB.registerUser({ name, email, password });
      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user,
      });
    }

    // MongoDB Mongoose flow
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email address already exists');
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    // Persistent JSON database mode when MongoDB is not running locally
    if (!isDBConnected()) {
      const user = await persistentDB.loginUser({ email, password });
      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    }

    // MongoDB Mongoose flow
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const user = persistentDB.getUserById(req.user._id);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
      return res.status(200).json({
        success: true,
        user,
      });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile & preferences
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const updatedUser = persistentDB.updateUserProfile(req.user._id, req.body);
      if (!updatedUser) {
        res.status(404);
        throw new Error('User not found');
      }
      const token = generateToken(updatedUser._id);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        token,
        user: updatedUser,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...req.body.preferences,
      };
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      token,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        preferences: updatedUser.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request a password reset code
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Please provide your account email address');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400);
      throw new Error('Please provide a valid email address');
    }

    const result = await persistentDB.generatePasswordResetCode(email);

    res.status(200).json({
      success: true,
      message: `Verification code generated for ${result.email}`,
      resetCode: result.resetCode,
      email: result.email,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password with verification code
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400);
      throw new Error('Please provide email, verification code, and new password');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters long');
    }

    await persistentDB.resetPasswordWithCode({ email, code, newPassword });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
