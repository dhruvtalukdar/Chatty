import express from "express";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Cloudinary route");
});

router.post('/upload', async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        // upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            public_id: "uploaded_image",
        });

        res.json({
            message: "Image uploaded successfully",
            url: uploadResult.secure_url
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;