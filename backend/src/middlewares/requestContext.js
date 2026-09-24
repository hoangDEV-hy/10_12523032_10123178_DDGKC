const { v4: uuidv4 } = require('uuid');

function requestContext(req, res, next) {
  req.requestId = req.get('X-Request-ID') || uuidv4();
  res.set('X-Request-ID', req.requestId);
  next();
}

module.exports = requestContext;
