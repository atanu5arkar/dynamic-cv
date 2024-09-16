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
        const skills = [], languages = [], experience = [], education = [];

        // Fill up the skills array
        for (let i = 1; `skill${i}` in formData; i++) {
            skills.push({
                label: formData[`skill${i}`],
                range: formData[`skillRange${i}`]
            });
        }
        // Fill up the languages array
        for (let i = 1; `lang${i}` in formData; i++) {
            languages.push({
                label: formData[`lang${i}`],
                range: formData[`langRange${i}`]
            });
        }
        // Fill up the experience array
        for (let i = 1; `job${i}` in formData; i++) {
            experience.push({
                job: formData[`job${i}`],
                description: formData[`desc${i}`]
            });
        }
        // Fill up the education array
        for (let i = 1; `inst${i}` in formData; i++) {
            education.push({
                institute: formData[`inst${i}`],
                qualification: formData[`qual${i}`]
            });
        }
        const { fname, gender, address, occupation, email, phone } = formData;

        await new CVModel({
            fname: fname.trim().toLowerCase(),
            gender, address, occupation, email, phone, skills, languages, experience, education
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

        const cv = await CVModel.findOne({ fname: fname.toLowerCase() });
        if (!cv) return res.render('404');

        const { gender, address, occupation, email, phone, skills, languages, experience, education } = cv;
        // return res.render('cv', { ...cv, fname: fname.toUpperCase() });

        return res.render('cv', {
            fname: fname.toUpperCase(),
            gender, address, occupation, email, phone, skills, languages, experience, education
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
        return res.status(302).redirect(`/cv/${fname.trim()}`);
    } catch (error) {
        console.log(error);
        return res.status(302).json({ msg: 'Server Error' });
    }
});

export default cvRouter;