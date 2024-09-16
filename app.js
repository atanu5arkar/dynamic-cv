import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import "./utils/dbConnect.js"
import isLoggedIn from "./middlewares/isLoggedIn.js";

import cvRouter from "./routers/cvRouter.js";

const app = express();
const port = process.env.PORT || 1234;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/cv', cvRouter);

/* 
    * Renders the admin login page.
    * If the req has a valid 'auth-token' cookie, then redirects to the CV registration page.
*/
app.get('/login', isLoggedIn, (req, res) => {
    return res.render('login', { error: null });
});

/* 
    * For valid admin credentials, creates a JWT and sets it as a 'auth-token' cookie.
    * Redirects to the CV registration page.
*/
app.post('/login', (req, res) => {
    try {
        const { ADMIN, PASS } = process.env;
        const { username, password } = req.body;

        if (ADMIN != username || PASS != password)
            return res.render('login', { error: 'Invalid Credentials!' });

        const token = jwt.sign({ admin: username }, process.env.JWT_KEY);

        res.cookie('auth-token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3 * 60 * 60 * 1000)
        });

        return res.status(302).redirect('/cv/register');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

/* Clears the cookie and redirects to the login page. */
app.get('/logout', (req, res) => {
    return res
        .clearCookie('auth-token', { httpOnly: true })
        .status(302).redirect('/login');
});

app.listen(port, () => console.log(`Server listening at ${port}.`));
