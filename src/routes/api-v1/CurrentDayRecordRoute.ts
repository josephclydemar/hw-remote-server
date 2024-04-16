import express, { Router } from 'express';

import DayRecordsController from '../../controllers/DayRecordController';

const router: Router = express.Router();

router.route('/current_day_record').get(DayRecordsController.getCurrentDayRecord);
// router.route('/day_records/:id').

export default router;
