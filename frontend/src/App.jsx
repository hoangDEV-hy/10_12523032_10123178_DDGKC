import { useCallback, useEffect, useState } from 'react';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import ModelComparison from './components/ModelComparison';
import PredictionHistory from './components/PredictionHistory';
import {
  checkHealth,
  compareAllModels,
  getApiErrorMessage,
  getPredictionHistory,
  predictByModel
} from './services/api';

const offlineHealth = {
  backend: 'offline',
  mongodb: 'offline',
  ai_service: 'offline'
};

function StatusItem({ label, status }) {
  const isOnline = status === 'ok';
  return (
    <span className={`status-item ${isOnline ? 'online' : 'offline'}`}>
      <i aria-hidden="true" />
      {label}: {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}

function App() {
  const [health, setHealth] = useState(null);
  const [result, setResult] = useState(null);
  const [predictionError, setPredictionError] = useState('');
  const [comparisonResults, setComparisonResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const loadHealth = useCallback(async () => {
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (error) {
      console.error('Không thể kiểm tra trạng thái hệ thống:', error);
      setHealth(offlineHealth);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    setHistoryError('');
    try {
      const data = await getPredictionHistory();
      setHistory(Array.isArray(data.predictions) ? data.predictions.slice(0, 50) : []);
    } catch (error) {
      console.error('Không thể tải lịch sử:', error);
      setHistoryError(getApiErrorMessage(error));
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
    loadHistory();
  }, [loadHealth, loadHistory]);

  const handlePredict = async (model, input) => {
    setIsPredicting(true);
    setPredictionError('');
    setResult(null);
    try {
      const data = await predictByModel(model, input);
      setResult(data);
      await loadHistory();
    } catch (error) {
      console.error('Lỗi dự đoán:', error);
      setPredictionError(getApiErrorMessage(error));
    } finally {
      setIsPredicting(false);
      loadHealth();
    }
  };

  const handleCompare = async (input) => {
    setIsComparing(true);
    setComparisonResults(null);
    try {
      const data = await compareAllModels(input);
      setComparisonResults(data);
      await loadHistory();
    } catch (error) {
      console.error('Lỗi so sánh mô hình:', error);
    } finally {
      setIsComparing(false);
      loadHealth();
    }
  };

  const currentHealth = health || offlineHealth;

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <a className="brand" href="#top" aria-label="Về đầu trang">
            <span className="brand-mark">D</span>
            <span>Diamond ML</span>
          </a>
          <nav aria-label="Điều hướng chính">
            <a href="#prediction">Dự đoán</a>
            <a href="#comparison">So sánh mô hình</a>
            <a href="#history">Lịch sử</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">Machine Learning Project</span>
            <h1>Dự đoán giá kim cương</h1>
            <p>
              Ước tính giá và đối chiếu kết quả từ bốn mô hình hồi quy trên cùng một bộ thông số.
            </p>
          </div>

          <aside className="health-panel" aria-label="Trạng thái hệ thống">
            <div className="health-title">
              <span>Trạng thái hệ thống</span>
              <button type="button" onClick={loadHealth}>Kiểm tra lại</button>
            </div>
            <div className="status-list">
              <StatusItem label="Backend" status={currentHealth.backend} />
              <StatusItem label="MongoDB" status={currentHealth.mongodb} />
              <StatusItem label="AI Service" status={currentHealth.ai_service} />
            </div>
          </aside>
        </section>

        <div className="content-stack">
          <PredictionForm
            onPredict={handlePredict}
            onCompare={handleCompare}
            isPredicting={isPredicting}
            isComparing={isComparing}
          />

          <PredictionResult result={result} error={predictionError} />

          <ModelComparison
            comparisonResults={comparisonResults}
            isComparing={isComparing}
          />

          <PredictionHistory
            history={history}
            isLoading={isHistoryLoading}
            error={historyError}
            onRefresh={loadHistory}
          />
        </div>
      </main>

      <footer>
        Diamond Price Prediction · React + Vite
      </footer>
    </>
  );
}

export default App;
