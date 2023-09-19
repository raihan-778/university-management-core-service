import { Router } from 'express';
import { BuildingController } from './building.controller';

const router = Router();

router.get('/', BuildingController.getAllFromDB);
router.post('/', BuildingController.insertIntoDB);

export const BuildingRoutes = router;
