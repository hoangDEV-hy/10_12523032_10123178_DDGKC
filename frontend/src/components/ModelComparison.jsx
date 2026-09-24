const metrics = [
  { model: 'Linear Regression', mae: 791.7, rmse: 1127.92, r2: 0.92 },
  { model: 'Decision Tree', mae: 321.9, rmse: 628.22, r2: 0.98 },
  { model: 'Random Forest', mae: 263.34, rmse: 519.21, r2: 0.98 },
  { model: 'Gradient Boosting', mae: 361.59, rmse: 651.99, r2: 0.97 }
];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function ModelComparison({ comparisonResults, isComparing }) {
  return (
    <section id="comparison" className="section-card">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Đánh giá</span>
          <h2>So sánh mô hình</h2>
        </div>
        <p>Các metric được tính trên tập test trong quá trình huấn luyện.</p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mô hình</th>
              <th>MAE</th>
              <th>RMSE</th>
              <th>R²</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.model}>
                <td>{metric.model}</td>
                <td>{metric.mae.toFixed(2)}</td>
                <td>{metric.rmse.toFixed(2)}</td>
                <td>{metric.r2.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="metric-notes">
        <span>MAE càng thấp càng tốt.</span>
        <span>RMSE càng thấp càng tốt.</span>
        <span>R² càng gần 1 càng tốt.</span>
      </div>

      <div className="live-comparison">
        <div>
          <span className="eyebrow">Cùng một dữ liệu đầu vào</span>
          <h3>So sánh dự đoán</h3>
        </div>

        {isComparing && <p className="muted-text">Đang nhận kết quả từ 4 mô hình...</p>}

        {!isComparing && !comparisonResults && (
          <p className="muted-text">
            Nhập thông tin ở phần Dự đoán và chọn “So sánh 4 mô hình”.
          </p>
        )}

        {comparisonResults && (
          <div className="comparison-grid" aria-live="polite">
            {comparisonResults.map((result) => (
              <article className={`comparison-item ${result.status}`} key={result.model}>
                <span>{result.label}</span>
                {result.status === 'success' ? (
                  <strong>{formatPrice(result.data.predicted_price)}</strong>
                ) : (
                  <small>{result.message}</small>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ModelComparison;
