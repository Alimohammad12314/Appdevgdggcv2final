import express from 'express';
import { CheckUser, Login, Logout, register } from '../controllers/Auth.js';
import { IsUser } from '../middleware/verifyToken.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const AuthRoutes = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *       required:
 *         - id
 *         - email
 *         - role
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 */
AuthRoutes.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
AuthRoutes.post('/login', Login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
AuthRoutes.post('/logout', Logout);

/**
 * @swagger
 * /auth/CheckUser:
 *   get:
 *     summary: Check if the user is authenticated
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *       401:
 *         description: Unauthorized
 */
AuthRoutes.get('/CheckUser', IsUser, CheckUser);

// Google OAuth Routes
AuthRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

AuthRoutes.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
  const token = jwt.sign({ userId: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ success: true, message: 'Google Sign-In successful', token, user: req.user });
});

// Facebook OAuth Routes
AuthRoutes.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

AuthRoutes.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
  const token = jwt.sign({ userId: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ success: true, message: 'Facebook Sign-In successful', token, user: req.user });
});

// Twitter OAuth Routes
AuthRoutes.get('/twitter', passport.authenticate('twitter'));

AuthRoutes.get('/twitter/callback', passport.authenticate('twitter', { session: false }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(200).json({ success: true, message: 'Twitter Sign-In successful', token, user: req.user });
});

export default AuthRoutes;
