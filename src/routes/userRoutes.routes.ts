import { authMiddleware } from './../middleware/authMiddleware.middleware';
import express, { Router } from 'express';
import { changePassword, deactivateSelf, deleteUserById, getAllUsers, getUserById, getUserProfile, updateProfile } from '../controllers/userController.controller';
import { authorizeRole } from '../middleware/roleAuthorize.middleware';
const router:Router = express.Router();

router.get("/getUserProfile",authMiddleware,getUserProfile);
router.put("/updateProfile",authMiddleware,updateProfile);
router.delete("/deactivateUserSelf",authMiddleware,deactivateSelf);
router.put("/changePassword",authMiddleware,changePassword)
router.get("/getAllUsers",authMiddleware,authorizeRole(["Admin"]),getAllUsers);
router.get("/getUserById/:userId",authMiddleware,authorizeRole(["Admin"]),getUserById);
router.delete("/deleteUserById/:userId",authMiddleware,authorizeRole(["Admin"]),deleteUserById);

export default router;