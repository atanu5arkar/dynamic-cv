import jwt from "jsonwebtoken";

function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies['auth-token'];
        if (!token) return next(); 

        jwt.verify(token, process.env.JWT_KEY);        
        return res.status(302).redirect('/cv/register');
        
    } catch (error) {
        return res.status(302).redirect('/logout');
    }
}

export default isLoggedIn;