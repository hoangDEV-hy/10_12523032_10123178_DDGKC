const axios = require('axios');

const aiClient = axios.create({
  baseURL: process.env.AI_SERVICE_URL,
  timeout: 10000
});

function requestHeaders(requestId) {
  return { 'X-Request-ID': requestId };
}

async function checkHealth(requestId) {
  const response = await aiClient.get('/health', {
    headers: requestHeaders(requestId)
  });
  return response.data;
}

async function getModelInfo(requestId) {
  const response = await aiClient.get('/model-info', {
    headers: requestHeaders(requestId)
  });
  return response.data;
}

async function predict(endpoint, input, requestId) {
  const response = await aiClient.post(endpoint, input, {
    headers: requestHeaders(requestId)
  });
  return response.data;
}

module.exports = { checkHealth, getModelInfo, predict };
