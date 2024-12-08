// const bcrypt = require("bcrypt");
// const User = require("../model/User");
// const Admin = require("../model/Admin");
//
// const jwt = require("jsonwebtoken");
//
// const authController = {
//     register: async (req, res) => {
//         const { username, email, password, address, work, profile_picture_path } = req.body;
//
//         try {
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(409).json({ message: "Email already exists" });
//             }
//
//             const salt = await bcrypt.genSalt();
//             const hashPassword = await bcrypt.hash(password, salt);
//             const newUser = new User({
//                 username,
//                 email,
//                 password: hashPassword,
//                 address,
//                 work,
//                 profile_picture_path,
//             });
//
//             await newUser.save();
//             return res.status(201).json({ message: "User registered successfully", user: newUser });
//         } catch (error) {
//             return res.status(500).json({ error: "Failed to register user" });
//         }
//     },
//
//     login: async (req, res) => {
//         try {
//             const { email, password } = req.body;
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(401).json({ message: "Authentication failed: User not found" });
//             }
//
//             const isPasswordCorrect = await bcrypt.compare(password, user.password);
//             if (!isPasswordCorrect) {
//                 return res.status(401).json({ message: "Password is incorrect" });
//             }
//
//             const token = getToken(user);
//             return res.status(200).json({
//                 message: "Login successful",
//                 user,
//                 token,
//             });
//         } catch (error) {
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     },
//
//     checkAuth: async (req, res) => {
//         try {
//             const id = req.user._id;
//             const user = await User.findById(id);
//             res.status(200).json(user);
//         } catch (error) {
//             res.status(401).json({message: "Authentication"});
//         }
//     }
// };
//
// module.exports = authController;
//
// function getToken(user) {
//     return jwt.sign({
//         data: user
//     }, process.env.JWT_KEY , { expiresIn: '5h' })
// }
//
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");

const authController = {
    register: async (req, res) => {
        const { username, email, password, address, work, profile_picture_path } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already exists" });
            }

            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                username,
                email,
                password: hashPassword,
                address,
                work,
                profile_picture_path,
            });

            await newUser.save();
            return res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            return res.status(500).json({ error: "Failed to register user" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Authentication failed: User not found" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Password is incorrect" });
            }

            const token = getToken(user);
            return res.status(200).json({
                message: "Login successful",
                user,
                token,
            });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    checkAuth: async (req, res) => {
        try {
            const id = req.user._id;
            const user = await User.findById(id);
            res.status(200).json(user);
        } catch (error) {
            res.status(401).json({ message: "Authentication failed" });
        }
    },

    adminRegister: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(409).json({ message: "Admin email already exists" });
            }

            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            const newAdmin = new Admin({
                username,
                email,
                password: hashPassword,
            });

            await newAdmin.save();
            return res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
        } catch (error) {
            return res.status(500).json({ error: "Failed to register admin" });
        }
    },

    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({ message: "Authentication failed: Admin not found" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, admin.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Password is incorrect" });
            }

            const token = getAdminToken(admin);
            return res.status(200).json({
                message: "Admin login successful",
                admin,
                token,
            });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    checkAdminAuth: async (req, res) => {
        try {
            const id = req.admin._id;
            const admin = await Admin.findById(id);
            res.status(200).json(admin);
        } catch (error) {
            res.status(401).json({ message: "Authentication failed" });
        }
    }
};

module.exports = authController;

function getToken(user) {
    return jwt.sign({
        data: user
    }, process.env.JWT_KEY, { expiresIn: '5h' });
}

function getAdminToken(admin) {
    return jwt.sign({
        data: admin
    }, process.env.JWT_KEY, { expiresIn: '5h' });
}
