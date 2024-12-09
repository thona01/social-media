const bcrypt = require("bcrypt");
const Admin = require("../model/Admin");
const jwt = require("jsonwebtoken");

const adminController = {
    Adminregister: async (req, res) => {
        const { username, email, password, address, work, profile_picture_path} = req.body;

        try {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(409).json({ message: "Email already exists" });
            }

            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            const newAdmin = new Admin({
                username,
                email,
                password: hashPassword,
                address,
                work,
                profile_picture_path,
            });

            await newAdmin.save();
            return res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
        } catch (error) {
            return res.status(500).json({ error: "Failed to register Admin" });
        }
    },

    Adminlogin: async (req, res) => {
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
                message: "Login successful",
                admin,
                token,
            });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    adminCheckAuth: async (req, res) => {
        try {
            const id = req.admin._id;
            const admin = await Admin.findById(id);
            res.status(200).json(admin);
        } catch (error) {
            res.status(401).json({ message: "Authentication failed" });
        }
    },


};

module.exports = adminController;


function getAdminToken(admin) {
    return jwt.sign({
        data: admin
    }, process.env.JWT_KEY, { expiresIn: '5h' });
}