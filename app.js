import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import "./utils/dbConnect.js"
import cvRouter from "./routers/cvRouter.js";

const app = express();
const port = process.env.PORT || 1234;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/cv', cvRouter);

app.get('/login', (req, res) => {
    try {
        return res.render('login', { error: null });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { ADMIN, PASS } = process.env;
        const { username, password } = req.body;

        if (ADMIN != username || PASS != password)
            return res.render('login', { error: 'Invalid Credentials!' });

        const token = jwt.sign({ admin: username }, process.env.JWT_KEY);

        res.cookie('auth-token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        return res.status(302).redirect('/cv/register');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

app.listen(port, () => console.log(`Server listening at ${port}.`));