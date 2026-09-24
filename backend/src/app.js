require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const requestContext = require('./middlewares/requestContext');
const requestLogger = require('./middlewares/requestLogger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || '127.0.0.1';

app.use(cors());
app.use(requestContext);
app.use(requestLogger);
app.use(express.json());
app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('MongoDB chưa được cấu hình');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'diamond_prediction',
      serverSelectionTimeoutMS: 10000
    });
    console.log('Đã kết nối MongoDB database diamond_prediction');
  } catch (error) {
    console.error(`Không thể kết nối MongoDB | type=${error.name || 'Error'}`);
  }
}

async function startServer() {
  await connectDatabase();
  app.listen(port, host, () => {
    console.log(`Backend đang chạy tại http://${host}:${port}`);
  });
}

startServer();

module.exports = app;
