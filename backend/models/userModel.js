import mongoose from 'mongoose';
import 'dotenv/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Joi from 'joi';

const userSchema = new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    role: {
      type: String,
      enum: ["STUDENT", "FACULTY", "ADMIN"],
      default: "STUDENT",
    },
    department: {
      type: String,
    },
    graduationYear: {
      type: Number,
    },
    profileImage: {
      type: String,
    },
    quote: {
      type: String,
    },
    hobbies: {
      type: [String],
    },
    rememberFor: {
      type: String,
    },
    achievements: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    password: { type: String },
    isEmailConfirmed: { type: Boolean, default: false }, 
    confirmationToken: String, 
    confirmationSentAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  });


userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateEmailConfirmationToken = function () {
  const token = jwt.sign({ email: this.email }, process.env.EMAIL_VERIFICATION_SECRET, { expiresIn: '1h' });
  this.confirmationToken = token;
  this.confirmationSentAt = new Date();
  return token;
};

userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])'))
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, and uppercase letter',
      }),
    role: Joi.string().valid('seller', 'buyer'),
  });
  return schema.validate(user);
}

const User = mongoose.model('User', userSchema);
export default User;