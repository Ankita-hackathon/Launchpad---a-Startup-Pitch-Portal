module.exports = function roleAuth(requiredRole) {
    return (req, res, next) => {
        const { role } = req.body;

        if (!role) {
            return res.status(401).json({ message: "Role not provided" });
        }

        if (role !== requiredRole) {
            return res.status(403).json({
                message: `Access denied. ${requiredRole} only.`,
            });
        }

        next();
    };
};
