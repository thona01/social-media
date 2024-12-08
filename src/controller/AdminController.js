import User from '../model/User'; // Replace with your actual user model
import { StatusCodes } from 'http-status-codes'; // Optional for better status code management
import bcrypt from 'bcryptjs'; // Optional if you need password hashing

const adminController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find(); // Adjust query based on your needs
            res.status(StatusCodes.OK).json(users);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users', error });
        }
    },

    createUser: async (req, res) => {
        const { username, email, password, role } = req.body;
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' });
            }

            // Hash the password before saving (optional but recommended)
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role: role || 'user', // Default to 'user' if no role is provided
            });

            await newUser.save();
            res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating user', error });
        }
    },

    deleteUser: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            }
            res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting user', error });
        }
    },

    updateUser: async (req, res) => {
        const { userId } = req.params;
        const updateData = req.body;

        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
                new: true, // Return the updated document
                runValidators: true, // Ensure validators are run
            });

            if (!updatedUser) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            }

            res.status(StatusCodes.OK).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user', error });
        }
    },

    getProfile: async (req, res) => {
        const { adminId } = req.params; // Assume admin ID is passed as a parameter
        try {
            const admin = await User.findById(adminId);
            if (!admin) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Admin not found' });
            }
            res.status(StatusCodes.OK).json(admin);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching admin profile', error });
        }
    },

    updateProfile: async (req, res) => {
        const { adminId } = req.params; // Assume admin ID is passed as a parameter
        const updateData = req.body;

        try {
            const updatedProfile = await User.findByIdAndUpdate(adminId, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedProfile) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'Admin not found' });
            }

            res.status(StatusCodes.OK).json({ message: 'Admin profile updated successfully', profile: updatedProfile });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating admin profile', error });
        }
    },
};

export default adminController;
