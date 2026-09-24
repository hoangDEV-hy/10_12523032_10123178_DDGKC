const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema(
  {
    carat: { type: Number, required: true },
    cut: { type: String, required: true },
    color: { type: String, required: true },
    clarity: { type: String, required: true },
    depth: { type: Number, required: true },
    table: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    request_id: { type: String, required: true, index: true },
    model: {
      type: String,
      required: true,
      enum: [
        'linear_regression',
        'decision_tree',
        'random_forest',
        'gradient_boosting'
      ]
    },
    input: { type: inputSchema, required: true },
    predicted_price: { type: Number, required: true },
    created_at: { type: Date, default: Date.now, index: true }
  },
  {
    collection: 'prediction_history',
    versionKey: false
  }
);

module.exports = mongoose.model('Prediction', predictionSchema);
