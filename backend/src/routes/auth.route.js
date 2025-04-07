import express from 'express';
import { register, login, getAllUser, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/random", (req, res) => {
    res.send("Random route");
});

router.get("/get-all-user", getAllUser);

// register a user
router.post("/register", register);

// login a user
router.post("/login", login);

// logout a user
router.get("/logout", logout);

// update profile
router.post("/update-profile", protectRoute, updateProfile);

// check auth
router.get("/check-auth", protectRoute, checkAuth);

export default router;