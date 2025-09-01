import express, { Router } from 'express';

import authRoutes from "./authRoutes.routes";
import roleRoutes from "./roleRoutes.routes";
import userRoutes from "./userRoutes.routes";    
const router:Router = express.Router();

router.use("/api/auth",authRoutes);
router.use("/api/role",roleRoutes);
router.use("/api/user",userRoutes);

export default router;