import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export const authenticateUser = async (req, res, next) => {
  await dbConnect();

  // Check for token in cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Not authorized to access. Please sign in with valid credentials",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is an admin
    if (req.user.roles !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Not authorized to access. Please sign in with valid credentials",
    });
  }
};
