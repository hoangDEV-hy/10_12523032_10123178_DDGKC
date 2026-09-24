const Prediction = require('../models/Prediction');
const aiService = require('../services/aiService');
const mongoose = require('mongoose');

const MODEL_CONFIG = {
  linear_regression: '/predict/linear-regression',
  decision_tree: '/predict/decision-tree',
  random_forest: '/predict/random-forest',
  gradient_boosting: '/predict/gradient-boosting'
};

function predictWithModel(modelName) {
  return async function predict(req, res) {
    let aiResult;

    try {
      aiResult = await aiService.predict(
        MODEL_CONFIG[modelName],
        req.body,
        req.requestId
      );
    } catch (_error) {
      console.error(
        `request_id=${req.requestId} | model=${modelName} | AI Service không khả dụng`
      );
      return res.status(503).json({
        message: 'AI Service hiện không khả dụng',
        request_id: req.requestId
      });
    }

    const responseRequestId = aiResult.request_id;
    if (!responseRequestId || responseRequestId !== req.requestId) {
      console.error(
        `request_id=${req.requestId} | model=${modelName} | AI Service trả request_id không khớp`
      );
      return res.status(502).json({
        message: 'Phản hồi từ AI Service không hợp lệ',
        request_id: req.requestId
      });
    }

    if (
      aiResult.model !== modelName ||
      typeof aiResult.predicted_price !== 'number' ||
      !Number.isFinite(aiResult.predicted_price)
    ) {
      console.error(
        `request_id=${req.requestId} | model=${modelName} | dữ liệu AI Service không hợp lệ`
      );
      return res.status(502).json({
        message: 'Phản hồi từ AI Service không hợp lệ',
        request_id: req.requestId
      });
    }

    if (mongoose.connection.readyState !== 1) {
      console.error(
        `request_id=${req.requestId} | model=${modelName} | MongoDB không khả dụng`
      );
      return res.status(503).json({
        message: 'Dự đoán thành công nhưng MongoDB hiện không khả dụng',
        request_id: req.requestId
      });
    }

    try {
      await Prediction.create({
        request_id: responseRequestId,
        model: modelName,
        input: req.body,
        predicted_price: aiResult.predicted_price
      });
    } catch (error) {
      console.error(
        `request_id=${req.requestId} | model=${modelName} | không thể lưu MongoDB | type=${error.name || 'Error'}`
      );
      return res.status(500).json({
        message: 'Dự đoán thành công nhưng không thể lưu lịch sử',
        request_id: req.requestId
      });
    }

    console.log(
      `request_id=${responseRequestId} | model=${modelName} | predicted_price=${aiResult.predicted_price}`
    );
    return res.status(200).json({
      request_id: responseRequestId,
      model: modelName,
      predicted_price: aiResult.predicted_price,
      message: 'Dự đoán giá thành công'
    });
  };
}

module.exports = { predictWithModel };
