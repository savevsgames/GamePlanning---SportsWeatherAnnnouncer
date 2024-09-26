import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';
import announcerRoutes from './announcerRoutes.js';

router.use('/weather', weatherRoutes);
router.use('/announcer', announcerRoutes);

export default router;
