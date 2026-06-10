# AI-Powered API với Redis & BullMQ

Dự án này là một REST API được xây dựng bằng **Node.js (Express)**, đóng vai trò như một proxy thông minh kết nối tới **AI (Anthropic/GLM)**. Nó sử dụng **Redis & BullMQ** để quản lý hàng đợi (queue) các yêu cầu (jobs) và caching, đồng thời ghi lại toàn bộ log hoạt động vào **SQL Server**.

## 🚀 Tính năng nổi bật
1. **Hàng đợi không đồng bộ (Asynchronous Queue):** Khi bạn gửi câu hỏi, hệ thống không bắt bạn chờ đợi AI trả lời ngay mà sẽ đẩy yêu cầu vào hàng đợi (BullMQ), giúp Server không bị quá tải.
2. **Bộ nhớ đệm thông minh (Cache):** Nếu một câu hỏi (và context) đã từng được giải quyết, hệ thống sẽ lấy kết quả từ Redis ra trả về ngay lập tức (tiết kiệm thời gian & chi phí gọi AI API).
3. **Agentic Loop & Tool Calling:** AI được cấp quyền sử dụng các công cụ bên ngoài (ví dụ: `get_weather`, `calculate`). Nếu bạn hỏi phép toán, AI sẽ nhờ ứng dụng tự tính toán bằng thư viện `mathjs` an toàn thay vì tự đoán kết quả. Vòng lặp AI này giới hạn số lượt (max rounds) để tránh tốn token vô hạn.
4. **Ghi log chi tiết (Observability):** Mọi request gửi tới AI, số lượng token đã dùng, thời gian phản hồi, danh sách các tool đã gọi... đều được lưu lại tự động vào SQL Server (`ai_api_logs`).

---

## 🏗️ Kiến trúc & Cách hoạt động

1. **Client** gọi `POST /api/ask` gửi câu hỏi (prompt).
2. **Express Server** tiếp nhận, tạo một Job và đẩy vào Queue (BullMQ) qua **Redis**, sau đó trả ngay `jobId` cho Client.
3. **Client** liên tục gọi `GET /api/job/:id` (polling) để kiểm tra xem AI đã trả lời xong chưa.
4. Ở dưới nền, **AI Worker** sẽ lấy Job ra khỏi Queue:
   - *Bước 4.1:* Worker kiểm tra **Redis Cache**. Nếu đã có câu trả lời từ trước -> Trả luôn kết quả.
   - *Bước 4.2:* Nếu chưa có, Worker gửi request tới **AI Proxy (GLM/Anthropic)**.
   - *Bước 4.3:* AI phân tích. Nếu AI muốn gọi tool (ví dụ: `calculate`), Worker sẽ thực thi hàm tính toán và gửi kết quả ngược lại cho AI để AI đưa ra câu trả lời cuối cùng.
5. Khi có câu trả lời cuối, Worker lưu kết quả vào **Redis Cache** và ghi log vào **SQL Server**.
6. **Client** gọi `GET /api/job/:id` lần tiếp theo sẽ nhận được kết quả cuối cùng này.

---

## 🛠️ Cài đặt & Chuẩn bị (Prerequisites)

- **Node.js** v20 trở lên.
- **Docker** & Docker Compose (để chạy Redis).
- **SQL Server** đang chạy ở cổng mặc định `1433`. Mật khẩu tài khoản `sa` đã được thiết lập.

### Bước 1: Clone và Cài đặt thư viện
Mở Terminal / PowerShell trong thư mục `ai-api` và chạy:
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
Mở file `.env` (hoặc tạo từ `.env.example`) và điền đầy đủ thông tin:
```env
# Điền mật khẩu sa của SQL Server
MSSQL_PASSWORD=your_sql_password_here

# Điền Token của hệ thống AI Proxy
ANTHROPIC_AUTH_TOKEN=your_ai_token_here
```

### Bước 3: Chuẩn bị Cơ sở dữ liệu & Redis
**1. Tạo DB trong SQL Server:**
Mở SQL Server Management Studio (SSMS) và chạy:
```sql
CREATE DATABASE ai_api_logs;
```

**2. Khởi động Redis:**
Mở Terminal và chạy:
```bash
docker-compose up -d
```

---

## 🏃‍♂️ Hướng dẫn chạy dự án

Bạn chỉ cần chạy 1 lệnh duy nhất để khởi động cả Web Server và Background Worker:
```bash
npm run dev
```

Kiểm tra trạng thái (Health Check) tại trình duyệt: `http://localhost:3000/health`

---

## 📡 Hướng dẫn sử dụng API bằng Postman

Thay vì sử dụng các lệnh Terminal/PowerShell phức tạp, bạn có thể dễ dàng kiểm thử API này bằng phần mềm **Postman**.

### 1. Gửi câu hỏi cho AI (Tạo Job)

1. Mở Postman, tạo một **Request mới**.
2. Đổi phương thức thành **`POST`**.
3. Điền URL: **`http://localhost:3000/api/ask`**
4. Chuyển sang tab **Body**, chọn **`raw`** và đổi định dạng từ Text sang **`JSON`**.
5. Nhập nội dung câu hỏi vào khung bên dưới:

   **Ví dụ 1: Câu hỏi thông thường**
   ```json
   {
     "prompt": "Calculate sqrt(144) + 2^10"
   }
   ```

   **Ví dụ 2: Câu hỏi theo ngữ cảnh hội thoại (Multi-turn)**
   ```json
   {
     "prompt": "Thế còn ở Hồ Chí Minh thì sao?",
     "messages": [
       {"role": "user", "content": "Thời tiết ở Hà Nội thế nào?"},
       {"role": "assistant", "content": "Ở Hà Nội trời nắng và 32 độ C."}
     ]
   }
   ```
6. Bấm nút **Send**.
7. **Kết quả trả về:** Bạn sẽ nhận được một JSON chứa `jobId`. Hãy copy số ID này để dùng cho bước tiếp theo.
   ```json
   {
     "jobId": "1",
     "status": "queued"
   }
   ```

### 2. Kiểm tra kết quả (Polling)

Vì hệ thống xử lý AI không đồng bộ qua hàng đợi, bạn cần dùng `jobId` nhận được ở bước 1 để lấy kết quả.

1. Tạo một **Request mới** trong Postman.
2. Đổi phương thức thành **`GET`**.
3. Điền URL: **`http://localhost:3000/api/job/1`** *(Thay số `1` bằng `jobId` của bạn)*
4. Bấm nút **Send**.

**Các trường hợp kết quả trả về:**

- **Trường hợp 1: AI đang bận xử lý (Chưa xong)**
  ```json
  {
    "status": "active" 
  }
  ```
  *(Nếu gặp trạng thái này, hãy đợi vài giây và bấm Send lại)*

- **Trường hợp 2: AI đã xử lý xong**
  ```json
  {
    "status": "completed",
    "result": {
      "answer": "12 + 1024 = 1036.",
      "toolCallsUsed": 1,
      "toolNames": ["calculate"],
      "fromCache": false,
      "inputTokens": 350,
      "outputTokens": 80
    }
  }
  ```
  *(Lưu ý: Nếu bạn gọi lại API `POST` bằng đúng câu hỏi cũ, `fromCache` sẽ mang giá trị `true` và `toolCallsUsed` sẽ là `0` vì hệ thống lấy thẳng kết quả từ Redis thay vì gọi lại AI)*
