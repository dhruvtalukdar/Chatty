import express from 'express';

const router = express.Router();

router.get('/random', (req, res) => {
    res.send("This is your real time chat application which is running on /api/auth");
});

router.post('/signUp', (req, res) => {
    res.send("Sign Up");
});

router.post('/signIn', (req, res) => {
    res.send("Sign In");
});

router.post('/signOut', (req, res) => {
    res.send("Sign Out");
});

export default router;