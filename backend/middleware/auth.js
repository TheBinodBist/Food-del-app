import jwt from "jsonwebtoken"

const authMiddleware  = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.Authorization || req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized user, Please Login" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = token_decode;
        req.userId = token_decode.id;
        next();
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

export default authMiddleware;