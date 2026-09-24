function requestLogger(req, res, next) {
  res.on('finish', () => {
    console.log(
      `request_id=${req.requestId} | method=${req.method} | path=${req.originalUrl} | status_code=${res.statusCode}`
    );
  });
  next();
}

module.exports = requestLogger;
