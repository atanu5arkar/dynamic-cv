import express from "express";

import authMiddleware from "../middlewares/auth.js";
import CVModel from "../models/CV.js";

const cvRouter = express.Router();

cvRouter.use('/register', authMiddleware);

cvRouter.get('/register', (req, res) => {
    try {
        return res.render('cvForm');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

cvRouter.post('/register', async (req, res) => {
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
        const { fname, occupation, email, phone } = formData;

        await new CVModel({
            fname, occupation, email, phone, experience, education 
        }).save();

        return res.render('cvForm');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
})

export default cvRouter;