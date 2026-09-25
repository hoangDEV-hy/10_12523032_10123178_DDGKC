import { useState } from 'react';
import { MODEL_OPTIONS } from '../services/api';

const initialValues = {
  carat: '0.5',
  cut: 'Ideal',
  color: 'E',
  clarity: 'SI1',
  depth: '61.5',
  table: '55',
  x: '5',
  y: '5.05',
  z: '3.1'
};

const numericFields = ['carat', 'depth', 'table', 'x', 'y', 'z'];

function PredictionForm({
  onPredict,
  onCompare,
  isPredicting,
  isComparing
}) {
  const [values, setValues] = useState(initialValues);
  const [selectedModel, setSelectedModel] = useState('random_forest');
  const [validationError, setValidationError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setValidationError('');
  };

  const prepareInput = () => {
    for (const field of numericFields) {
      const value = values[field];
      if (value === '' || !Number.isFinite(Number(value)) || Number(value) <= 0) {
        setValidationError('Tất cả trường số phải là số lớn hơn 0.');
        return null;
      }
    }

    return {
      ...values,
      carat: Number(values.carat),
      depth: Number(values.depth),
      table: Number(values.table),
      x: Number(values.x),
      y: Number(values.y),
      z: Number(values.z)
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = prepareInput();
    if (input) onPredict(selectedModel, input);
  };

  const handleCompare = () => {
    const input = prepareInput();
    if (input) onCompare(input);
  };

  const isBusy = isPredicting || isComparing;

  return (
    <section id="prediction" className="section-card prediction-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Dự đoán</span>
          <h2>Thông tin kim cương</h2>
        </div>
        <p>Nhập thông số và chọn mô hình phù hợp để ước tính giá.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Trọng lượng (Carat)
            <input
              type="number"
              name="carat"
              min="0.01"
              step="0.01"
              value={values.carat}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Chất lượng cắt
            <select name="cut" value={values.cut} onChange={handleChange}>
              {['Fair', 'Good', 'Very Good', 'Premium', 'Ideal'].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            Màu sắc
            <select name="color" value={values.color} onChange={handleChange}>
              {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            Độ tinh khiết
            <select name="clarity" value={values.clarity} onChange={handleChange}>
              {['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF'].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            Độ sâu
            <input type="number" name="depth" min="0.01" step="0.1" value={values.depth} onChange={handleChange} required />
          </label>

          <label>
            Kích thước mặt bàn
            <input type="number" name="table" min="0.01" step="0.1" value={values.table} onChange={handleChange} required />
          </label>

          <label>
            Chiều dài (x)
            <input type="number" name="x" min="0.01" step="0.01" value={values.x} onChange={handleChange} required />
          </label>

          <label>
            Chiều rộng (y)
            <input type="number" name="y" min="0.01" step="0.01" value={values.y} onChange={handleChange} required />
          </label>

          <label>
            Chiều sâu (z)
            <input type="number" name="z" min="0.01" step="0.01" value={values.z} onChange={handleChange} required />
          </label>
        </div>

        <div className="model-choice">
          <label htmlFor="model">Mô hình dự đoán</label>
          <select
            id="model"
            value={selectedModel}
            onChange={(event) => setSelectedModel(event.target.value)}
          >
            {MODEL_OPTIONS.map((model) => (
              <option key={model.key} value={model.key}>{model.label}</option>
            ))}
          </select>
        </div>

        {validationError && <p className="message error-message">{validationError}</p>}

        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isBusy}>
            {isPredicting ? 'Đang dự đoán...' : 'Dự đoán'}
          </button>
          <button className="secondary-button" type="button" onClick={handleCompare} disabled={isBusy}>
            {isComparing ? 'Đang so sánh...' : 'So sánh 4 mô hình'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PredictionForm;
