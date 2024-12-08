import express from "express";
import verifyToken from "../middleware/authMiddleware";
import adminController from "../controller/AdminController";

const router = express.Router();

// Admin Dashboard
router.get("/dashboard", verifyToken("admin"), (req, res) => {
    res.json({ message: "Admin authenticated", admin: req.user });
});

// Admin-specific actions (examples)
router.get("/users", verifyToken("admin"), adminController.getAllUsers); // Fetch all users
router.post("/create-user", verifyToken("admin"), adminController.createUser); // Create a user
router.delete("/delete-user/:id", verifyToken("admin"), adminController.deleteUser); // Delete a user by ID
router.put("/update-user/:id", verifyToken("admin"), adminController.updateUser); // Update user details

// Admin Profile
router.get("/profile", verifyToken("admin"), adminController.getProfile); // Get admin profile
router.put("/profile", verifyToken("admin"), adminController.updateProfile); // Update admin profile

export default router;
