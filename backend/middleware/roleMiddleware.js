const authRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Error: 403 Access denied!! " })   
        }
        next();
    }
};

export default authRoles;