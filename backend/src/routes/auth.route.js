import express from 'express';

const router = express.Router();

router.post("/signup", (req, res) => {
    res.send("Signup route");
});

router.post("/signin", (req, res) => {
    res.send("Signin route");
});

router.post("/signout", (req, res) => {
    res.send("Signout route");
});


router.put("/update-profile", (req, res) => {
    res.send("Update profile route");
});

export default router;