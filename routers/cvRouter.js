import express from "express";

import authMiddleware from "../middlewares/auth.js";
import CVModel from "../models/CV.js";

const cvRouter = express.Router();

// Protected Routes
cvRouter.get('/register', authMiddleware, (req, res) => {
    return res.render('cvForm');
});


cvRouter.post('/register', authMiddleware, async (req, res) => {
    try {
        const formData = req.body
        const experience = [], education = [];

        for (let i = 1; `job${i}` in formData; i++) {
            experience.push({
                job: formData[`job${i}`],
                description: formData[`desc${i}`]
            });
        }
        for (let i = 1; `inst${i}` in formData; i++) {
            education.push({
                institute: formData[`inst${i}`],
                qualification: formData[`qual${i}`]
            });
        }
        const { fname, gender, address, occupation, email, phone, cpp, js, rust } = formData;
        const languages = { cpp, js, rust };

        await new CVModel({
            fname: fname.trim().toLowerCase(),
            gender, address, occupation, email, phone, experience, education, languages
        }).save();

        return res.render('success');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

// Public Routes
cvRouter.get('/search', (req, res) => {
    return res.render('cvSearch');
});

cvRouter.get('/:fname', async (req, res) => {
    try {
        const { fname } = req.params;
        
        const cv = await CVModel.findOne({ fname: fname.trim().toLowerCase() });
        if (!cv) return res.render('404');

        const { gender, occupation, address, email, phone, experience, education, languages } = cv;

        return res.render('cv', {
            fname: fname.toUpperCase(),
            gender, occupation, address, email, phone, experience, education, languages
        });
    } catch (error) {
        console.log(error);
        return res.status(302).json({ msg: 'Server Error' });
    }
});

cvRouter.post('/search', async (req, res) => {
    try {
        const { fname } = req.body;
        const cv = await CVModel.findOne({ fname: fname.trim().toLowerCase() });

        if (!cv) return res.render('404');
        return res.status(302).redirect(`/cv/${fname}`);
    } catch (error) {
        console.log(error);
        return res.status(302).json({ msg: 'Server Error' });
    }
})

export default cvRouter;