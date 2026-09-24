# Diamond Price Prediction Frontend

Frontend React đơn giản cho hệ thống dự đoán giá kim cương. Ứng dụng chỉ gọi Backend Express, không gọi trực tiếp AI Service hoặc MongoDB Atlas.

## Công nghệ

- ReactJS
- Vite
- JavaScript
- Axios
- CSS thuần

## Cài đặt

```bash
npm install
```

## Biến môi trường

Tạo `.env` từ `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

Không đặt MongoDB URI, password hoặc token trong Frontend.

## Chạy ứng dụng

Khởi động AI Service và Backend trước, sau đó:

```bash
npm run dev
```

Vite mặc định mở Frontend tại `http://127.0.0.1:5173`.

## Backend URL

Frontend sử dụng Backend API từ biến `VITE_API_URL`. Giá trị local mặc định là:

```text
http://127.0.0.1:5000/api
```

## Chức năng

- Nhập và validate 9 thông số kim cương.
- Dự đoán bằng một trong bốn model.
- So sánh kết quả dự đoán của bốn model trên cùng dữ liệu.
- Hiển thị bảng metric MAE, RMSE và R² từ tập test.
- Hiển thị tối đa 50 bản ghi lịch sử từ MongoDB thông qua Backend.
- Hiển thị trạng thái Backend, MongoDB và AI Service.
