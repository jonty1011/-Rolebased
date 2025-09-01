import express, { Router } from 'express';
import { createRole } from '../controllers/roleController.controller';

const router:Router = express.Router();

router.post("/createRole",createRole);

export default router;