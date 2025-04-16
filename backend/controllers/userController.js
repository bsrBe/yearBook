import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import  uploadImage  from '../utils/cloudinary.js';

// Get all users with pagination
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department, graduationYear, quote, hobbies, rememberFor, achievements, } = req.body;
    let profileImage;
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      profileImage = await uploadImage(file);
    } else {
        //provide a default profile image
        profileImage = "https://res.cloudinary.com/djbxblywz/image/upload/v1709324274/placeholder-user_g3wtx4.jpg";
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      graduationYear,
      profileImage,
      quote,
      hobbies,
      rememberFor,
      achievements,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  try {
    const { name, email, role, department, graduationYear, quote, hobbies, rememberFor, achievements } = req.body;
    let profileImage;
    if (req.files && req.files.profileImage) {
        const file = req.files.profileImage;
        profileImage = await uploadImage(file);
      }
      else {
        profileImage = "https://res.cloudinary.com/djbxblywz/image/upload/v1709324274/placeholder-user_g3wtx4.jpg";
      }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        department,
        graduationYear,
        profileImage,
        quote,
        hobbies,
        rememberFor,
        achievements,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

export { getUsers, getUserById, createUser, updateUser };