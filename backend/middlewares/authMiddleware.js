import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const protect = async (req, res, next) =>{
  // Try to get the token from the cookies, specifically the "cookieToken" cookie

  const token = req.cookies.cookieToken;

  // If no token is found in the cookies
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token with JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed, unauthorized access
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
export default protect;
