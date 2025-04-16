import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res, next) => {
  const { name, email, password, role, profileImageUrl } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            profileImageUrl,
        });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide email and password" });
        }
        // Check if user exists
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ msg: "Invalid credentials, user not found" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Check if email is confirmed
        if (!user.isEmailConfirmed) {
            const confirmationToken = user.generateEmailConfirmationToken();
            await user.save({ validateBeforeSave: false });
            const confirmUrl = `${req.protocol}://${req.get("host")}/auth/confirm-email/${confirmationToken}`;
            const message = `Click the link to confirm your email: <a href="${confirmUrl}">Verify Email</a>`;
            await sendEmail({
                email: user.email,
                subject: "Email Confirmation",
                message,
            });
            return res.status(403).json({ msg: "Please verify your email. Confirmation link sent." });
        }
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIES_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "None",
        secure: false, // Enable CSRF protection by restricting cross-site cookies
    };
    if (process.env.NODE_ENV === "Production") {
        options.secure = true;
    }

    // Set the cookie and log it for debugging
    // res.cookie("cookieToken", token, options);
    // console.log("Cookie Set:", res.getHeaders()["set-cookie"]);

    res
        .status(statusCode)
        .cookie("cookieToken", token, options)
        .json({ user, token });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ msg: "user with this email not found" });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetPassword/${resetToken}`;
  const message = `You are receiving this email because you(or someone else)has requested reset of a password please make a put request to ${resetUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: "password reset",
            message,
        });
        return res.status(200).json({ success: true, msg: "Email sent successfully" });
    } catch (error) {
        console.error("Error during sendEmail:", error.message);
        user.resetPasswordToken = undefined,
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return res.status(500).json("email could not be sent");
    }
};

export const resetPassword = async (req, res) => {
  // Extract reset token from URL params
  let resetToken = req.params.token;
  console.log("Received reset token:", resetToken);

  if (!resetToken) {
    return res.status(400).json({ msg: "No reset token found in request" });
  }
  resetToken = resetToken.trim(); // Trim any leading/trailing spaces
  if (resetToken.startsWith(":")) {
    resetToken = resetToken.slice(1);
  }
  console.log("Trimmed token:", resetToken);
    try {
        // Hash the reset token to match with the stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Find the user based on the reset password token and expiry time
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token or token has expired' });
        }

        // Check if new password is valid
        const newPassword = req.body.password;
        if (!newPassword || typeof newPassword !== "string") {
            return res.status(400).json({ msg: "Invalid password format" });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Respond with the updated user and token
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;
    if (!token) {
        console.error("No token provided");
        return res.status(400).json({ msg: "No token provided" });    
    }
    try {
        
        const decoded = jwt.decode(token, { complete: true });
   

        if (!decoded) {
            console.error("Token could not be decoded.");
            return res.status(400).json({ msg: "Invalid token format" });
        }

        // Now verify the token
        const verifiedDecoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
        

        const user = await User.findOne({email: verifiedDecoded.email});

        if (!user) {
            console.log("User not found for email:", verifiedDecoded.email);
            return res.status(400).json({ msg: "Invalid token or user not found" });
        }

        // Mark email as confirmed
        user.isEmailConfirmed = true;
        user.confirmationToken = undefined;
        await user.save();

      
        res.status(200).json({ msg: "Email confirmed successfully. You can now log in." });

    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(400).json({ msg: "Invalid or expired token" });
    }
};
