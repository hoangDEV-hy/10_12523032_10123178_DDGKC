# Dataset - Diamonds

## 1. Nguồn dữ liệu

- Dataset: Diamonds
- Nguồn: Kaggle
- Tệp dữ liệu: `diamonds.csv`
- Số dòng ban đầu: 53,940
- Số cột ban đầu: 11

## 2. Mục tiêu

Dự án sử dụng dữ liệu kim cương để xây dựng các mô hình Machine Learning dự đoán giá kim cương (`price`).

## 3. Các thuộc tính sử dụng

| Thuộc tính | Ý nghĩa |
|---|---|
| `carat` | Trọng lượng kim cương |
| `cut` | Chất lượng cắt |
| `color` | Màu sắc |
| `clarity` | Độ tinh khiết |
| `depth` | Độ sâu |
| `table` | Kích thước mặt bàn |
| `x` | Chiều dài |
| `y` | Chiều rộng |
| `z` | Chiều sâu |
| `price` | Giá kim cương - biến mục tiêu |

## 4. Xử lý dữ liệu

Cột `Unnamed: 0` được loại bỏ vì chỉ là cột chỉ số.

Các bản ghi có giá trị không hợp lệ ở các thuộc tính `x`, `y`, `z` được loại bỏ.

Sau khi xử lý, dữ liệu còn:

- 53,920 dòng
- 10 cột

Trong đó có 9 thuộc tính đầu vào và 1 biến mục tiêu là `price`.

## 5. Chia dữ liệu

Dữ liệu được chia thành:

- 80% dữ liệu huấn luyện
- 20% dữ liệu kiểm tra
- `random_state = 42`

## 6. Ghi chú

Dataset được sử dụng cho mục đích học tập và xây dựng mô hình dự đoán giá kim cương. Dữ liệu không được sử dụng để định giá kim cương thực tế.