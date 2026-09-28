# Diamond Price Prediction

Hệ thống dự đoán giá kim cương bằng Machine Learning, gồm AI Service FastAPI, Backend Express và MongoDB Atlas.

## lệnh curl
https://resonant-askew-fiftieth.ngrok-free.dev/

##parameter test
Testcase cho POST /api/predict/**

Trường hợp ĐÚNG - Dữ liệu hợp lệ
Test Case	Tham số đầu vào	Kết quả mong muốn
Valid diamond 1	carat: 0.5, cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 200, predicted_price > 0, message: "Dự đoán giá thành công"

Valid diamond 2	carat: 1.0, cut: "Premium", color: "D", clarity: "IF", depth: 62.5, table: 56, x: 6.5, y: 6.48, z: 4.13	Status 200, predicted_price > 0, message: "Dự đoán giá thành công"

Valid diamond 3	carat: 0.1, cut: "Fair", color: "J", clarity: "I1", depth: 65, table: 60, x: 3.73, y: 3.71, z: 2.41	Status 200, predicted_price > 0
Trường hợp SAI - Dữ liệu không hợp lệ

Test Case	Tham số đầu vào	Kết quả mong muốn

Thiếu trường carat	cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "Dữ liệu đầu vào không hợp lệ (thiếu trường: carat)"
Thiếu nhiều trường	carat: 0.5, cut: "Ideal"	Status 400, message chứa "thiếu trường"

Trường thừa	carat: 0.5, cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1, price: 1000	Status 400, message: "Dữ liệu đầu vào không hợp lệ (trường không hợp lệ: price)"
carat = 0	carat: 0, cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "carat phải là số lớn hơn 0"

carat âm	carat: -0.5, cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "carat phải là số lớn hơn 0"

carat không phải số	carat: "0.5", cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "carat phải là số lớn hơn 0"
depth = 0	carat: 0.5, cut: "Ideal", color: "E", clarity: "SI1", depth: 0, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "depth phải là số lớn hơn 0"

table âm	carat: 0.5, cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: -55, x: 5, y: 5.05, z: 3.1	Status 400, message: "table phải là số lớn hơn 0"
x = NaN	carat: 0.5, cut: "Ideal", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: NaN, y: 5.05, z: 3.1	Status 400, message: "x phải là số lớn hơn 0"

cut không hợp lệ	carat: 0.5, cut: "Excellent", color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "cut phải thuộc một trong các giá trị: Fair, Good, Very Good, Premium, Ideal"
color không hợp lệ	carat: 0.5, cut: "Ideal", color: "A", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "color phải thuộc một trong các giá trị: D, E, F, G, H, I, J"

clarity không hợp lệ	carat: 0.5, cut: "Ideal", color: "E", clarity: "AAA", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "clarity phải thuộc một trong các giá trị: I1, SI2, SI1, VS2, VS1, VVS2, VVS1, IF"
cut không phải string	carat: 0.5, cut: 123, color: "E", clarity: "SI1", depth: 61.5, table: 55, x: 5, y: 5.05, z: 3.1	Status 400, message: "cut phải thuộc một trong các giá trị: Fair, Good, Very Good, Premium, Ideal"
Body không phải JSON object	[0.5, "Ideal", "E", "SI1", 61.5, 55, 5, 5.05, 3.1]	Status 400, message: "Dữ liệu đầu vào phải là một JSON object"
Body = null	null	Status 400, message: "Dữ liệu đầu vào phải là một JSON object"
Body = undefined	undefined	Status 400, message: "Dữ liệu đầu vào phải là một JSON object"

Testcase cho GET /api/predictions/:request_id
Test Case	Tham số đầu vào	Kết quả mong muốn

request_id hợp lệ tồn tại	:request_id = "valid-uuid"	Status 200, trả về prediction object

request_id không tồn tại	:request_id = "not-exist-uuid"	Status 404 hoặc 200 với data rỗng

request_id định dạng sai	:request_id = "invalid"	Status 400 hoặc 404

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
