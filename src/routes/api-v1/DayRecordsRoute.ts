import express, { Router } from 'express';

import DayRecordsController from '../../controllers/DayRecordController';

const router: Router = express.Router();

router.route('/day_records').get(DayRecordsController.getDayRecords).post(DayRecordsController.insertOneDayRecord);
// router.route('/day_records/:id').

export default router;
