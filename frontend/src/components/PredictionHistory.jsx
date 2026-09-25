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

function formatDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(new Date(date));
}

function PredictionHistory({ history, isLoading, error, onRefresh }) {
  return (
    <section id="history" className="section-card">
      <div className="section-heading history-heading">
        <div>
          <span className="eyebrow">MongoDB Atlas</span>
          <h2>Lịch sử dự đoán</h2>
        </div>
        <button className="secondary-button compact-button" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Đang tải...' : 'Làm mới lịch sử'}
        </button>
      </div>

      {error && <p className="message error-message" role="alert">{error}</p>}

      {!error && !isLoading && history.length === 0 && (
        <p className="empty-state">Chưa có lịch sử dự đoán.</p>
      )}

      {history.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>Model</th>
                <th>Giá dự đoán</th>
                <th>Request ID</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 50).map((item) => (
                <tr key={item._id || `${item.request_id}-${item.created_at}`}>
                  <td>{formatDate(item.created_at)}</td>
                  <td>{modelLabels[item.model] || item.model}</td>
                  <td className="history-price">{formatPrice(item.predicted_price)}</td>
                  <td className="request-id">{item.request_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PredictionHistory;
