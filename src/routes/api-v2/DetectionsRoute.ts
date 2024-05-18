import express, { Router } from 'express';

import DetectionsController from '../../controllers/DetectionController';

const DetectionsV2Router: Router = express.Router();

DetectionsV2Router.route('/detections').patch(DetectionsController.getSpecificDetections);

export default DetectionsV2Router;
