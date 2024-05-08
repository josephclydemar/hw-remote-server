import express, { Router } from 'express';

import DayRecordsController from '../../controllers/DayRecordController';

const DayRecordsV2Router: Router = express.Router();

DayRecordsV2Router.route('/day_records').get(DayRecordsController.getLatestDayRecord);
// DayRecordsV2Router.route('/day_records/:id').

export default DayRecordsV2Router;
