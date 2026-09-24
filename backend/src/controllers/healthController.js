const mongoose = require('mongoose');
const aiService = require('../services/aiService');

async function getHealth(req, res) {
  const mongodbOk = mongoose.connection.readyState === 1;
  let aiServiceOk = false;

  try {
    const health = await aiService.checkHealth(req.requestId);
    aiServiceOk = health.status === 'ok' && health.models_loaded === 4;
  } catch (_error) {
    console.error(
      `request_id=${req.requestId} | không thể kiểm tra AI Service`
    );
  }

  const allHealthy = mongodbOk && aiServiceOk;
  return res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'unavailable',
    backend: 'ok',
    mongodb: mongodbOk ? 'ok' : 'unavailable',
    ai_service: aiServiceOk ? 'ok' : 'unavailable'
  });
}

module.exports = { getHealth };
