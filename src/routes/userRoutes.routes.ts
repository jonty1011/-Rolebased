import express, { Router } from 'express';
import { getAllUsers } from '../controllers/userController.controller';
const router:Router = express.Router();

router.get("/getAllUsers",getAllUsers)
export default router;