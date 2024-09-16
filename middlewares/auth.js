import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(302).redirect('/login');

        jwt.verify(token, process.env.JWT_KEY);
        return next();
        
    } catch (error) {
        return res.status(302).redirect('/logout');
    }
}

export default authMiddleware;