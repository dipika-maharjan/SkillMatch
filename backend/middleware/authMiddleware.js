import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      if (
        req.user.tokenInvalidBefore &&
        decoded.iat <
          Math.floor(new Date(req.user.tokenInvalidBefore).getTime() / 1000)
      ) {
        return res.status(401).json({
          message: "Session expired. Please log in again.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token found",
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export { protect, authorizeRoles };
