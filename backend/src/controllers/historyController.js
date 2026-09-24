const Prediction = require('../models/Prediction');
const mongoose = require('mongoose');

function ensureDatabaseAvailable(req, res) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  res.status(503).json({
    message: 'MongoDB hiện không khả dụng',
    request_id: req.requestId
  });
  return false;
}

async function getPredictions(req, res, next) {
  if (!ensureDatabaseAvailable(req, res)) return;

  try {
    const predictions = await Prediction.find()
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    return res.json({
      count: predictions.length,
      predictions
    });
  } catch (error) {
    console.error(
      `request_id=${req.requestId} | không thể đọc lịch sử MongoDB | type=${error.name || 'Error'}`
    );
    return next(error);
  }
}

async function getPredictionByRequestId(req, res, next) {
  if (!ensureDatabaseAvailable(req, res)) return;

  try {
    const prediction = await Prediction.findOne({
      request_id: req.params.request_id
    }).lean();

    if (!prediction) {
      return res.status(404).json({
        message: 'Không tìm thấy lịch sử dự đoán',
        request_id: req.requestId
      });
    }

    return res.json(prediction);
  } catch (error) {
    console.error(
      `request_id=${req.requestId} | không thể tìm lịch sử MongoDB | type=${error.name || 'Error'}`
    );
    return next(error);
  }
}

module.exports = { getPredictions, getPredictionByRequestId };
