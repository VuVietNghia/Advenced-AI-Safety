# Cost Monitoring & Observability – Implementation Plan

## Mục tiêu

Xây dựng hệ thống theo dõi chi phí và giám sát hiệu suất cho các lệnh gọi AI, hỗ trợ đồng thời:
- **LM Studio** (chạy model cục bộ tại `localhost:1234`, giao tiếp qua OpenAI-compatible REST API) — **chỉ theo dõi token & latency, không tính tiền**
- **ZhipuAI GLM API** (via `https://llm-hub.roxane.one`) — theo dõi đầy đủ bao gồm tính chi phí ước tính theo token

Cấu hình provider đọc trực tiếp từ **`settings.json`** ở thư mục gốc project:
```json
{
  "ANTHROPIC_AUTH_TOKEN": "<api_key>",
  "ANTHROPIC_BASE_URL": "https://llm-hub.roxane.one",
  "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5",
  "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.6",
  "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
}
```

Công nghệ sử dụng: **Node.js + TypeScript**, không phụ thuộc vào framework lớn. Dashboard chạy **local** phục vụ mục đích học tập, không cần authentication.

---

## Kiến trúc tổng quan

```
┌─────────────────────────────────────────────────────────────────────┐
│              Browser: localhost:3000                                 │
│  ┌──────────────────────┐  [Toggle]  ┌─────────────────────────┐   │
│  │    💬 Chat View      │ ◄────────► │    📊 Dashboard View    │   │
│  │  - Chọn Provider    │            │  - Cards tổng quan      │   │
│  │  - Chọn Model       │            │  - Biểu đồ Charts       │   │
│  │  - Nhập prompt      │            │  - Bảng recent calls    │   │
│  │  - Xem câu trả lời  │            │  - Auto-refresh 10s     │   │
│  │  - Metrics per msg  │            │                         │   │
│  └──────────┬───────────┘            └─────────────────────────┘   │
└─────────────┼───────────────────────────────────────────────────────┘
              │ POST /api/chat
              ▼
┌─────────────────────────────────────────────────┐
│         Express Backend (server.ts)             │
│  /api/chat  ──►  AIClient.chat()               │
└───────┬─────────────────────────┬───────────────┘
        │                         │
        ▼                         ▼
┌───────────────────┐   ┌───────────────────────────┐
│  LM Studio        │   │  ZhipuAI GLM API           │
│  localhost:1234   │   │  llm-hub.roxane.one        │
│  [OpenAI SDK]     │   │  [Anthropic SDK + baseURL] │
└───────────────────┘   └───────────────────────────┘
        │                         │
        └──────────┬──────────────┘
                   │ Kết quả + Metrics
                   ▼
┌─────────────────────────────────────────────────┐
│              Metrics Collector                   │
│  - Token usage (prompt + completion)             │
│  - Latency (ms)                                  │
│  - Error / Success status                        │
│  - Model name, provider, timestamp               │
└───────────────────────┬─────────────────────────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
┌────────────────────┐   ┌─────────────────────┐
│   Logger (File +   │   │   SQLite Database    │
│   Console)         │   │   (logs.db)          │
│   logs/app.log     │   │   Stores all metrics │
└────────────────────┘   └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Dashboard View     │
                         │  (cùng localhost:3000│
                         │   realtime update)   │
                         └─────────────────────┘
```

---

## Cấu trúc thư mục

```
Cost Monitoring & Observability/
├── README.md                   ← Giải thích khái niệm (đã có)
├── package.json
├── tsconfig.json
├── src/
│   ├── providers/
│   │   ├── types.ts            ← Interface chung: AIProvider, AIResponse, Metrics
│   │   ├── lmStudioProvider.ts ← Kết nối LM Studio qua OpenAI SDK (localhost:1234)
│   │   └── zhipuProvider.ts    ← Kết nối ZhipuAI qua Anthropic SDK + custom baseURL
│   │
│   ├── core/
│   │   ├── aiClient.ts         ← Wrapper chính, tự động thu thập metrics
│   │   ├── metricsCollector.ts ← Tính toán & chuẩn hóa metrics
│   │   └── costCalculator.ts   ← Tính chi phí theo giá token từng provider
│   │
│   ├── storage/
│   │   ├── database.ts         ← Khởi tạo & truy vấn SQLite (better-sqlite3)
│   │   └── logger.ts           ← Ghi log ra file + console (winston)
│   │
│   ├── dashboard/
│   │   ├── server.ts           ← Express server phục vụ toàn bộ app
│   │   ├── api.ts              ← REST API: /api/metrics, /api/summary, /api/chat [MODIFY]
│   │   └── public/
│   │       ├── index.html      ← Single page: Chat View & Dashboard View [MODIFY]
│   │       ├── style.css       ← CSS cho cả 2 view [MODIFY]
│   │       └── app.js          ← Logic toggle view + chat + Chart.js [MODIFY]
│   │
│   └── demo.ts                 ← Script demo gọi AI và sinh dữ liệu test
│
└── logs/
    └── app.log                 ← Log file (tự sinh ra khi chạy)
```

---

## Các Phase thực hiện

### Phase 1 – Nền tảng & Cấu hình (Setup)

**Mục tiêu:** Khởi tạo project TypeScript, cài dependencies, định nghĩa kiểu dữ liệu.

#### Việc cần làm:
- [ ] Khởi tạo `package.json` với `"type": "module"`, scripts (`demo`, `dashboard`, `dev`)
- [ ] Cấu hình `tsconfig.json` (target ES2022, moduleResolution bundler)
- [ ] - **Không cần file `.env` riêng** — tất cả cấu hình đọc từ `settings.json` ở thư mục gốc:
  - `ANTHROPIC_AUTH_TOKEN` → API key cho ZhipuAI
  - `ANTHROPIC_BASE_URL` → `https://llm-hub.roxane.one`
  - `ANTHROPIC_DEFAULT_HAIKU_MODEL` → `glm-4.5` (model nhanh/rẻ)
  - `ANTHROPIC_DEFAULT_SONNET_MODEL` → `glm-4.6` (model trung bình)
  - `ANTHROPIC_DEFAULT_OPUS_MODEL` → `glm-4.7` (model mạnh nhất)
  - `LM_STUDIO_BASE_URL` → `http://localhost:1234/v1` (thêm vào settings.json)
  - `DASHBOARD_PORT` → `3000` (mặc định, có thể thêm vào settings.json)
- [ ] Cài dependencies:
  - **Runtime:** `openai` (cho LM Studio), `@anthropic-ai/sdk` (cho ZhipuAI), `express`, `better-sqlite3`, `winston`, `chart.js` (via CDN)
  - **Dev:** `typescript`, `tsx`, `@types/node`, `@types/express`, `@types/better-sqlite3`
- [ ] Định nghĩa `src/providers/types.ts` với các interface:
  - `AIProvider` (enum: `LM_STUDIO` | `ZHIPU_API`)
  - `AICallOptions` (prompt, model, provider, userId?)
  - `AIResponse` (content, usage, metrics)
  - `Metrics` (provider, model, promptTokens, completionTokens, totalTokens, latencyMs, estimatedCostUSD, isError, errorMessage, timestamp)
  - **Lưu ý:** `estimatedCostUSD` chỉ có giá trị thực với `ZHIPU_API`; với `LM_STUDIO` luôn là `null`

---

### Phase 2 – AI Client Wrapper & Provider

**Mục tiêu:** Xây dựng lớp kết nối đến AI model và tự động thu thập metrics.

#### `src/providers/lmStudioProvider.ts`
- **SDK:** `openai` package — LM Studio expose OpenAI-compatible REST API
- Khởi tạo: `new OpenAI({ baseURL: 'http://localhost:1234/v1', apiKey: 'lm-studio' })`
- Gọi `client.chat.completions.create()`, đọc `response.usage` để lấy `prompt_tokens` và `completion_tokens`
- **Không tính chi phí** — trường `estimatedCostUSD` trả về `null`
- Trả về `AIResponse` chuẩn

#### `src/providers/zhipuProvider.ts`
- **SDK:** `@anthropic-ai/sdk` — ZhipuAI expose API theo chuẩn Anthropic
- Khởi tạo:
  ```typescript
  import Anthropic from '@anthropic-ai/sdk';
  const client = new Anthropic({
    apiKey: settings.ANTHROPIC_AUTH_TOKEN,
    baseURL: settings.ANTHROPIC_BASE_URL, // https://llm-hub.roxane.one
  });
  ```
- Gọi `client.messages.create()` (Anthropic Messages API)
- Đọc `response.usage.input_tokens` và `response.usage.output_tokens`
- Hỗ trợ 3 model tier từ `settings.json`:
  - `ANTHROPIC_DEFAULT_HAIKU_MODEL` → `glm-4.5`
  - `ANTHROPIC_DEFAULT_SONNET_MODEL` → `glm-4.6`
  - `ANTHROPIC_DEFAULT_OPUS_MODEL` → `glm-4.7`
- Tính `estimatedCostUSD` dựa trên bảng giá GLM
- Trả về `AIResponse` chuẩn

> [!NOTE]
> **Lý do dùng Anthropic SDK cho ZhipuAI:** ZhipuAI endpoint tại `llm-hub.roxane.one` implement chuẩn Anthropic Messages API (không phải OpenAI Chat Completions API). Do đó phải dùng `@anthropic-ai/sdk` thay vì `openai` package.

#### `src/core/aiClient.ts` ← **Trung tâm của hệ thống**
- Nhận `AICallOptions`, xác định provider, tạo instance phù hợp
- Bao quanh lệnh gọi bằng `try/catch` và đo thời gian bằng `Date.now()`
- Sau khi có kết quả (hoặc lỗi), chuyển sang `metricsCollector` để xử lý
- Lưu metrics vào database, ghi log

#### `src/core/metricsCollector.ts`
- Nhận thô từ AI response, tạo object `Metrics` đầy đủ
- Gọi `costCalculator` để tính `estimatedCostUSD`

#### `src/core/costCalculator.ts`
- **LM Studio:** Bỏ qua — trả về `null` (không tính tiền cho model cục bộ)
- **ZhipuAI GLM models:** Định nghĩa bảng giá token:
  | Model | Input (per 1K tokens) | Output (per 1K tokens) |
  |---|---|---|
  | `glm-4.5` | $0.00014 | $0.00014 |
  | `glm-4.6` | $0.00028 | $0.00028 |
  | `glm-4.7` | $0.00140 | $0.00140 |
- Tính: `estimatedCostUSD = (promptTokens * inputPrice + completionTokens * outputPrice) / 1000`

---

### Phase 3 – Storage: Database & Logger

**Mục tiêu:** Lưu trữ bền vững và ghi log có cấu trúc.

#### `src/storage/database.ts`
- Dùng `better-sqlite3` (synchronous, không cần async, phù hợp với project nhỏ)
- Tạo bảng `ai_calls` với schema:
  ```sql
  CREATE TABLE IF NOT EXISTS ai_calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    provider TEXT,          -- 'LM_STUDIO' | 'ZHIPU_API'
    model TEXT,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    latency_ms INTEGER,
    estimated_cost_usd REAL, -- NULL nếu là LM Studio
    is_error INTEGER,        -- 0 hoặc 1
    error_message TEXT,
    user_id TEXT             -- tùy chọn, để track theo người dùng
  )
  ```
- Export các hàm: `insertMetrics()`, `getAllMetrics()`, `getSummary()`, `getMetricsByProvider()`

#### `src/storage/logger.ts`
- Dùng `winston` với 2 transport:
  - **Console**: hiển thị màu, mức `info` và `error`
  - **File** (`logs/app.log`): ghi tất cả log dạng JSON, mức `debug` trở lên
- Format log entry bao gồm: `timestamp`, `level`, `provider`, `model`, `latency_ms`, `total_tokens`, `is_error`

---

### Phase 4 – Dashboard Server

**Mục tiêu:** Hiển thị metrics trực quan qua web browser.

#### `src/dashboard/server.ts`
- Express server lắng nghe `DASHBOARD_PORT`
- Phục vụ static files từ `dashboard/public/`
- Mount router từ `api.ts`

#### `src/dashboard/api.ts` – REST API Endpoints:

| Endpoint | Mô tả |
|---|---|
| `GET /api/metrics` | Trả về toàn bộ log calls (có thể filter theo `?provider=` hoặc `?limit=`) |
| `GET /api/summary` | Tổng hợp: tổng token, tổng chi phí, avg latency, error rate |
| `GET /api/summary/by-provider` | Phân tách summary theo từng provider |
| `GET /api/summary/by-model` | Phân tách summary theo từng model |
| `GET /api/recent?n=20` | N lệnh gọi gần nhất |

#### `src/dashboard/public/index.html` + `app.js` – Giao diện Dashboard:

**Các thành phần hiển thị:**
1. **Cards tổng quan** (top): Tổng calls, Tổng tokens, Chi phí ước tính (chỉ Remote API), Error rate %
2. **Biểu đồ Line Chart**: Token usage theo thời gian (phân biệt LM Studio vs ZhipuAI GLM)
3. **Biểu đồ Bar Chart**: Latency trung bình theo model
4. **Biểu đồ Pie/Doughnut**: Phân bổ lệnh gọi theo provider
5. **Bảng Recent Calls**: Danh sách các lệnh gọi gần đây với trạng thái lỗi/thành công; cột chi phí hiển thị `N/A` cho LM Studio
6. **Auto-refresh** mỗi 10 giây để cập nhật realtime
7. **Không có authentication** — truy cập trực tiếp tại `http://localhost:3000`

---

### Phase 5 – Demo Script & Kiểm thử

**Mục tiêu:** Tạo script demo để sinh dữ liệu test và kiểm chứng toàn bộ hệ thống.

#### `src/demo.ts`
- Gọi AI với nhiều prompt khác nhau:
  - Vài lần với **LM Studio** (qua OpenAI SDK)
  - Vài lần với **ZhipuAI** từng model tier: `glm-4.5`, `glm-4.6`, `glm-4.7` (qua Anthropic SDK)
- Bao gồm cả các trường hợp lỗi (LM Studio chưa chạy, model sai) để kiểm tra error tracking
- In ra bảng tổng kết sau khi chạy xong

---

### Phase 6 – Chat UI tích hợp vào Dashboard [MỚI]

**Mục tiêu:** Thêm giao diện Chat thật sự vào `localhost:3000`. Người dùng tự tay nhập prompt → AI trả lời → metrics tự động cập nhật lên Dashboard.

#### Luồng hoạt động
```
Người dùng nhập prompt
  → chọn Provider (LM Studio / ZhipuAI) + Model
  → bấm Send
  → POST /api/chat { prompt, provider, model }
  → Server gọi AIClient.chat()               ← code đã có sẵn
  → AIClient tự log metrics vào SQLite + file log
  → Server trả về { content, metrics }
  → Chat View: hiển thị câu trả lời + metrics nhỏ bên dưới
  → Dashboard View: tự refresh, hiển thị call mới nhất
```

#### [MODIFY] `src/dashboard/api.ts` – Thêm endpoint `/api/chat`
- **`POST /api/chat`**: Body `{ prompt: string, provider: string, model: string }`
  - Parse provider string thành `AIProvider` enum
  - Gọi `aiClient.chat(options)`
  - Trả về JSON: `{ content, metrics }` gồm token counts, latency, cost
  - Metrics đã tự được lưu vào SQLite bởi `AIClient` (không cần làm gì thêm)
  - Server dùng `express.json()` middleware để parse body

#### [MODIFY] `src/dashboard/public/index.html` – Single Page 2 View

**Cấu trúc layout:**
```html
<nav>                          ← Thanh điều hướng cố định phía trên
  <button id="btn-chat">💬 Chat</button>
  <button id="btn-dashboard">📊 Dashboard</button>
</nav>

<section id="view-chat">       ← Chat View
  [Provider Selector] [Model Selector]
  [Chat Window - lịch sử hội thoại]
  [Input Area + Send Button]
</section>

<section id="view-dashboard" hidden>   ← Dashboard View (giữ nguyên như cũ)
  [Summary Cards]
  [Charts]
  [Recent Calls Table]
</section>
```

**Chat View – chi tiết từng thành phần:**
1. **Config bar** (trên cùng của Chat View):
   - Dropdown `Provider`: `LM Studio` | `ZhipuAI`
   - Khi chọn `LM Studio` → hiện text input để nhập tên model tự do (vd: `qwen2`, `llama3`)
   - Khi chọn `ZhipuAI` → hiện dropdown chọn `glm-4.5` / `glm-4.6` / `glm-4.7`
2. **Chat window** (vùng giữa, có thanh cuộn):
   - Bubble **người dùng** (phải, màu xanh): nội dung prompt
   - Bubble **AI** (trái, màu xám): nội dung trả lời
   - Dưới mỗi bubble AI: dòng metrics nhỏ `⚡ 312ms | 🪙 45 tokens | 💰 $0.0001`
   - Nếu lỗi: bubble màu đỏ nhạt, hiển thị thông báo lỗi
   - Khi đang chờ phản hồi: bubble AI có dấu `...` nhấp nháy
3. **Input area** (dưới cùng, cố định):
   - `<textarea>` có thể resize, `Enter` để gửi, `Shift+Enter` để xuống dòng
   - Nút `Send` — disabled + hiện spinner khi đang chờ AI phản hồi

#### [MODIFY] `src/dashboard/public/style.css`
- **Nav tabs**: 2 button dạng tab, button active có màu nền khác + underline
- **Chat bubbles**: Bo tròn, shadow nhẹ; user = xanh dương, AI = xám nhạt, error = đỏ nhạt
- **Metrics line**: Font `0.75rem`, `color: #888`, icon emoji nhỏ
- **Input area**: Sticky bottom, textarea tự expand, border focus highlight
- **Spinner**: CSS `@keyframes` animation, hiển thị trong bubble AI khi loading
- **Responsive**: Grid layout tự điều chỉnh ở màn hình nhỏ

#### [MODIFY] `src/dashboard/public/app.js`
- **`switchView(view)`**: Toggle `hidden` attribute giữa `#view-chat` và `#view-dashboard`; highlight button active
- **`sendMessage()`**:
  1. Lấy nội dung từ textarea
  2. Thêm bubble người dùng vào Chat window
  3. Thêm bubble AI đang loading (`...`)
  4. Gọi `fetch('POST /api/chat', { prompt, provider, model })`
  5. Nhận response, thay thế bubble loading bằng nội dung thật + metrics line
  6. Cuộn Chat window xuống cuối
- **`updateModelSelector(provider)`**: Khi đổi provider, cập nhật model input (text hoặc dropdown)
- **Dashboard auto-refresh**: Giữ nguyên `setInterval(fetchData, 10000)` — luôn chạy nền dù đang ở view nào

---

## Dependencies dự kiến

```json
{
  "dependencies": {
    "openai": "^4.52.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "express": "^4.19.0",
    "better-sqlite3": "^9.6.0",
    "winston": "^3.13.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.15.0",
    "@types/node": "^20.14.0",
    "@types/express": "^4.17.0",
    "@types/better-sqlite3": "^7.6.0"
  }
}
```

> **Lưu ý về 2 SDK:**
> | SDK | Dùng cho | API style |
> |---|---|---|
> | `openai` | LM Studio | `client.chat.completions.create()` → `response.usage.prompt_tokens` |
> | `@anthropic-ai/sdk` | ZhipuAI GLM | `client.messages.create()` → `response.usage.input_tokens` |

*Chart.js sẽ được load qua CDN trong `index.html`, không cần cài vào `node_modules`.*

---


## Verification Plan

### Automated / Script Tests
```bash
# Chạy demo script (sinh dữ liệu test)
npx tsx src/demo.ts

# Khởi động dashboard và kiểm tra thủ công
npx tsx src/dashboard/server.ts
```

### Manual Verification
1. **Logging**: Sau khi chạy `demo.ts`, kiểm tra file `logs/app.log` có ghi đầy đủ không.
2. **Database**: Mở `logs/ai_calls.db` bằng DB Browser hoặc query qua script để xác nhận dữ liệu.
3. **Dashboard**: Mở `http://localhost:3000`, kiểm tra tất cả biểu đồ và số liệu tổng hợp hiển thị chính xác.
4. **LM Studio**: Đảm bảo LM Studio đang chạy ở `localhost:1234` trước khi test.
5. **Error Tracking**: Cố tình gọi với model sai, xác nhận lỗi xuất hiện trong dashboard.
