const modelLabels = {
  linear_regression: 'Linear Regression',
  decision_tree: 'Decision Tree',
  random_forest: 'Random Forest',
  gradient_boosting: 'Gradient Boosting'
};

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function PredictionResult({ result, error }) {
  if (!result && !error) return null;

  if (error) {
    return (
      <div className="result-card error-result" role="alert">
        <span className="result-label">Không thể dự đoán</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="result-card" aria-live="polite">
      <span className="result-label">Giá dự đoán</span>
      <strong className="price">{formatPrice(result.predicted_price)}</strong>
      <dl className="result-details">
        <div>
          <dt>Model</dt>
          <dd>{modelLabels[result.model] || result.model}</dd>
        </div>
        <div>
          <dt>Request ID</dt>
          <dd className="request-id">{result.request_id}</dd>
        </div>
      </dl>
      <p className="success-message">{result.message || 'Dự đoán giá thành công'}</p>
    </div>
  );
}

export default PredictionResult;
