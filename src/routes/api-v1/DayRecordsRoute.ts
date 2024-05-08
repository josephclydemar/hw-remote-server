import express, { Router } from 'express';

import DayRecordsController from '../../controllers/DayRecordController';

const DayRecordsV1Router: Router = express.Router();

DayRecordsV1Router.route('/day_records').get(DayRecordsController.getDayRecords).post(DayRecordsController.insertOneDayRecord);
// DayRecordsV1Router.route('/day_records/:id').

export default DayRecordsV1Router;
