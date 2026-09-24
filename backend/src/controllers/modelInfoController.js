const aiService = require('../services/aiService');

async function getModelInfo(req, res) {
  try {
    const modelInfo = await aiService.getModelInfo(req.requestId);
    return res.json(modelInfo);
  } catch (_error) {
    console.error(
      `request_id=${req.requestId} | AI Service không khả dụng khi lấy model-info`
    );
    return res.status(503).json({
      message: 'AI Service hiện không khả dụng',
      request_id: req.requestId
    });
  }
}

module.exports = { getModelInfo };
