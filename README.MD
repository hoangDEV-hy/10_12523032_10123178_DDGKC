# Diamond Price Prediction

Hệ thống dự đoán giá kim cương bằng Machine Learning, gồm AI Service FastAPI, Backend Express và MongoDB Atlas.

## Kiến trúc hiện tại

```text
Client
  |
  v
Backend (Express, port 5000)
  |-- MongoDB Atlas: diamond_prediction
  `-- AI Service (FastAPI, port 8000)
        `-- 4 regression models
```

Backend không load model Machine Learning. Toàn bộ model được AI Service nạp vào RAM khi khởi động và được gọi qua HTTP.

## Cấu trúc

```text
.
|-- ai-models/
|   |-- app/main.py
|   |-- models/
|   `-- requirements.txt
|-- backend/
|   |-- src/
|   |-- .env.example
|   |-- package.json
|   `-- README.md
|-- .gitattributes
|-- .gitignore
`-- README.MD
```

## AI Service

```powershell
cd ai-models
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API chính:

- `GET /health`
- `GET /model-info`
- `POST /predict`
- `POST /predict/linear-regression`
- `POST /predict/decision-tree`
- `POST /predict/random-forest`
- `POST /predict/gradient-boosting`

## Backend

Tạo `backend/.env` từ `backend/.env.example`, điền MongoDB Atlas URI và chạy:

```powershell
cd backend
npm install
npm start
```

API chính:

- `GET /api/health`
- `GET /api/model-info`
- `POST /api/predict/linear-regression`
- `POST /api/predict/decision-tree`
- `POST /api/predict/random-forest`
- `POST /api/predict/gradient-boosting`
- `GET /api/predictions`
- `GET /api/predictions/:request_id`

## Bảo mật

- Không commit `.env`, MongoDB URI, password hoặc token.
- Chỉ commit `.env.example` không chứa credential thật.
- Các model `.joblib` được quản lý bằng Git LFS.

Xem hướng dẫn chi tiết Backend tại [`backend/README.md`](backend/README.md).
