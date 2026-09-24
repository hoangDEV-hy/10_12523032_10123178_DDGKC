# Diamond Price Prediction Backend

Backend Express đóng vai trò API Gateway và business logic cho hệ thống dự đoán giá kim cương. Backend validate dữ liệu, gọi AI Service qua HTTP, lưu lịch sử vào MongoDB Atlas và trả kết quả cho client. Backend không load hoặc thực hiện Machine Learning.

## Công nghệ

- Node.js và JavaScript
- Express
- Mongoose
- Axios
- dotenv
- cors
- uuid
- nodemon (development)

## Cấu trúc

```text
backend/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Cài đặt và cấu hình

```bash
npm install
```

Sao chép `.env.example` thành `.env`, sau đó cấu hình:

```env
PORT=5000
MONGODB_URI=
AI_SERVICE_URL=http://127.0.0.1:8000
```

Điền MongoDB Atlas URI của bạn vào `MONGODB_URI`. Không chia sẻ hoặc đưa file `.env` lên Git.

## Chạy Backend

Khởi động AI Service tại cổng 8000 trước, sau đó chạy Backend:

```bash
npm start
```

Chế độ development:

```bash
npm run dev
```

Backend chạy tại `http://127.0.0.1:5000`.

## API

- `GET /api/health`
- `GET /api/model-info`
- `POST /api/predict/linear-regression`
- `POST /api/predict/decision-tree`
- `POST /api/predict/random-forest`
- `POST /api/predict/gradient-boosting`
- `GET /api/predictions`
- `GET /api/predictions/:request_id`

## Ví dụ dự đoán

Request:

```json
{
  "carat": 0.5,
  "cut": "Ideal",
  "color": "E",
  "clarity": "SI1",
  "depth": 61.5,
  "table": 55,
  "x": 5,
  "y": 5.05,
  "z": 3.1
}
```

Response:

```json
{
  "request_id": "example-request-id",
  "model": "random_forest",
  "predicted_price": 1354.14,
  "message": "Dự đoán giá thành công"
}
```
