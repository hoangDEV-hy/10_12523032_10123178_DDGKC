import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const MODEL_OPTIONS = [
  {
    key: 'linear_regression',
    label: 'Linear Regression',
    endpoint: '/predict/linear-regression'
  },
  {
    key: 'decision_tree',
    label: 'Decision Tree',
    endpoint: '/predict/decision-tree'
  },
  {
    key: 'random_forest',
    label: 'Random Forest',
    endpoint: '/predict/random-forest'
  },
  {
    key: 'gradient_boosting',
    label: 'Gradient Boosting',
    endpoint: '/predict/gradient-boosting'
  }
];

export async function checkHealth() {
  const response = await apiClient.get('/health', {
    validateStatus: () => true
  });
  return response.data;
}

export async function predictLinearRegression(data) {
  const response = await apiClient.post('/predict/linear-regression', data);
  return response.data;
}

export async function predictDecisionTree(data) {
  const response = await apiClient.post('/predict/decision-tree', data);
  return response.data;
}

export async function predictRandomForest(data) {
  const response = await apiClient.post('/predict/random-forest', data);
  return response.data;
}

export async function predictGradientBoosting(data) {
  const response = await apiClient.post('/predict/gradient-boosting', data);
  return response.data;
}

const predictionFunctions = {
  linear_regression: predictLinearRegression,
  decision_tree: predictDecisionTree,
  random_forest: predictRandomForest,
  gradient_boosting: predictGradientBoosting
};

export function predictByModel(model, data) {
  const predict = predictionFunctions[model];
  if (!predict) {
    throw new Error('Model không hợp lệ.');
  }
  return predict(data);
}

export async function compareAllModels(data) {
  const settledResults = await Promise.allSettled(
    MODEL_OPTIONS.map((model) => predictionFunctions[model.key](data))
  );

  return settledResults.map((result, index) => {
    const model = MODEL_OPTIONS[index];
    if (result.status === 'fulfilled') {
      return {
        model: model.key,
        label: model.label,
        status: 'success',
        data: result.value
      };
    }

    return {
      model: model.key,
      label: model.label,
      status: 'error',
      message: getApiErrorMessage(result.reason)
    };
  });
}

export async function getPredictionHistory() {
  const response = await apiClient.get('/predictions');
  return response.data;
}

export function getApiErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Không thể kết nối Backend.';
  }
  if (error.response.status === 400) {
    return 'Dữ liệu nhập chưa hợp lệ.';
  }
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
