const express = require('express');
const { getHealth } = require('../controllers/healthController');
const { getModelInfo } = require('../controllers/modelInfoController');
const { predictWithModel } = require('../controllers/predictionController');
const {
  getPredictions,
  getPredictionByRequestId
} = require('../controllers/historyController');
const validateDiamond = require('../middlewares/validateDiamond');

const router = express.Router();

router.get('/health', getHealth);
router.get('/model-info', getModelInfo);

router.post(
  '/predict/linear-regression',
  validateDiamond,
  predictWithModel('linear_regression')
);
router.post(
  '/predict/decision-tree',
  validateDiamond,
  predictWithModel('decision_tree')
);
router.post(
  '/predict/random-forest',
  validateDiamond,
  predictWithModel('random_forest')
);
router.post(
  '/predict/gradient-boosting',
  validateDiamond,
  predictWithModel('gradient_boosting')
);

router.get('/predictions', getPredictions);
router.get('/predictions/:request_id', getPredictionByRequestId);

module.exports = router;
