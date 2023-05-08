import {Router} from 'express'
import { getPing } from '../controllers/index.controller.js';

const router = Router();

router.get('/ping',getPing)

router.get('/pinpin',getPing)

export default router;