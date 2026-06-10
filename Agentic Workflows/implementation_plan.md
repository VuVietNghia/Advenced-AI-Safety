# Agentic Workflows - TypeScript Implementation

Xây dựng một AI Agent bằng TypeScript (from scratch, không dùng LangChain) minh họa đầy đủ các khái niệm:
- **Plan → Execute → Verify loop**: Agent tự phân rã task → thực thi từng bước → kiểm tra kết quả → lặp lại nếu cần.
- **Multi-step tool chains**: Agent có thể gọi nhiều tool liên tiếp, đầu ra tool trước là đầu vào tool sau.
- **Dual-provider**: Chuyển đổi linh hoạt giữa **Local Model** (LM Studio qua OpenAI SDK) và **Frontier Model** (z.ai qua Anthropic SDK).

### Thông tin đã xác nhận
| Hạng mục | Chi tiết |
|---|---|
| Kiến trúc | From scratch (tự viết control loop) |
| Local Provider | **LM Studio** (`http://localhost:1234/v1`) |
| Local Models | `gemma-4-e4b`, `qwen-3.5-9b`, `rnj-1` |
| Frontier Provider | **z.ai** (`https://api.z.ai/api/anthropic`) — Anthropic SDK |
| Frontier API Key | ✅ Đã có |
| Tools | `calculator`, `web_search` (giả lập), `file_reader` |

## User Review Required

> [!WARNING]
> **Yêu cầu trước khi chạy**: LM Studio phải đang chạy trên máy (port 1234) với một trong 3 model: `gemma-4-e4b`, `qwen-3.5-9b`, hoặc `rnj-1` đã được load sẵn.

---

## Proposed Changes

### Cấu trúc thư mục

```
agentic-workflows/
├── Agentic_Workflows_README.md     (đã có)
├── package.json                     [NEW]
├── tsconfig.json                    [NEW]
├── .env                             [NEW]  ← API keys & cấu hình provider
├── src/
│   ├── config.ts                    [NEW]  ← Đọc .env, export cấu hình LM Studio / z.ai
│   ├── providers/
│   │   ├── types.ts                 [NEW]  ← Interface chung cho mọi LLM provider
│   │   ├── local-provider.ts        [NEW]  ← LM Studio (OpenAI SDK, localhost:1234)
│   │   └── frontier-provider.ts     [NEW]  ← z.ai (Anthropic SDK)
│   ├── tools/
│   │   ├── tool-registry.ts         [NEW]  ← Đăng ký & quản lý tools
│   │   ├── calculator.tool.ts       [NEW]  ← Tool tính toán
│   │   ├── web-search.tool.ts       [NEW]  ← Tool tìm kiếm web (giả lập)
│   │   └── file-reader.tool.ts      [NEW]  ← Tool đọc file
│   ├── agent/
│   │   ├── planner.ts               [NEW]  ← Bước PLAN: phân rã task thành steps
│   │   ├── executor.ts              [NEW]  ← Bước EXECUTE: thực thi từng step
│   │   ├── verifier.ts              [NEW]  ← Bước VERIFY: kiểm tra kết quả
│   │   └── agent-loop.ts            [NEW]  ← Vòng lặp chính Plan→Execute→Verify
│   ├── memory/
│   │   └── conversation-memory.ts   [NEW]  ← Lưu lịch sử messages & step results
│   └── main.ts                      [NEW]  ← Entry point, CLI interface
```

---

### Component 1: Project Setup

#### [NEW] [package.json](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/package.json)
- `"type": "module"` (ESM)
- Dependencies:
  - `openai` — SDK cho Local Model (LM Studio dùng OpenAI-compatible API tại `localhost:1234/v1`)
  - `@anthropic-ai/sdk` — SDK cho Frontier Model (z.ai dùng Anthropic-compatible API)
  - `dotenv` — Đọc API keys từ file `.env`
  - `tsx` — Chạy TypeScript trực tiếp
  - `typescript`, `@types/node` — Dev dependencies
- Scripts:
  - `"start": "tsx src/main.ts"` — Chạy theo `PROVIDER` trong `.env`
  - `"start:local": "cross-env PROVIDER=local tsx src/main.ts"` — Ép chạy LM Studio
  - `"start:frontier": "cross-env PROVIDER=frontier tsx src/main.ts"` — Ép chạy z.ai

#### [NEW] [tsconfig.json](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/tsconfig.json)
- Giống cấu hình rag-demo: `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`

#### [NEW] [.env](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/.env)
```env
# --- Provider Selection ---
PROVIDER=local                        # "local" = LM Studio | "frontier" = z.ai

# --- LM Studio (Local) ---
LOCAL_BASE_URL=http://localhost:1234/v1
LOCAL_MODEL=qwen-3.5-9b              # Hoặc: gemma-4-e4b, rnj-1

# --- z.ai (Frontier) ---
ZAI_API_KEY=your-z-ai-key-here
ZAI_MODEL=glm-4-plus                 # Model z.ai bạn muốn dùng
```

---

### Component 2: Provider Abstraction (Trừu tượng hóa LLM Provider)

Đây là phần **quan trọng nhất** — cho phép chuyển đổi giữa LM Studio và z.ai mà Agent code không cần biết đang dùng provider nào.

#### [NEW] [types.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/providers/types.ts)

Định nghĩa interface chung:
```typescript
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
}

export interface ToolCall {
  toolName: string;
  toolInput: Record<string, unknown>;
}

export interface LLMResponse {
  text: string | null;         // Phản hồi text (nếu có)
  toolCalls: ToolCall[];       // Danh sách tool calls (nếu có)
  stopReason: "end_turn" | "tool_use" | "max_tokens";
}

export interface LLMProvider {
  chat(messages: Message[], tools: ToolDefinition[]): Promise<LLMResponse>;
}
```

#### [NEW] [local-provider.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/providers/local-provider.ts)
- Dùng `openai` SDK, trỏ `baseURL` sang LM Studio (`http://localhost:1234/v1`)
- `apiKey` set thành `"lm-studio"` (bắt buộc nhưng LM Studio không check)
- Chuyển đổi `ToolDefinition` → format `tools` của OpenAI (JSON Schema)
- Chuyển đổi response OpenAI (`tool_calls[]`) → `LLMResponse` chuẩn
- Hỗ trợ chuyển model: `gemma-4-e4b`, `qwen-3.5-9b`, `rnj-1` qua biến `LOCAL_MODEL` trong `.env`

#### [NEW] [frontier-provider.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/providers/frontier-provider.ts)
- Dùng `@anthropic-ai/sdk`, trỏ `baseUrl` sang `https://api.z.ai/api/anthropic`
- Chuyển đổi `ToolDefinition` → format `tools` của Anthropic (JSON Schema chuẩn Anthropic)
- Chuyển đổi response Anthropic (`content[].type === "tool_use"`) → `LLMResponse` chuẩn

---

### Component 3: Tool System

#### [NEW] [tool-registry.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/tools/tool-registry.ts)
- Quản lý danh sách tools đã đăng ký
- Method `register(tool)`, `execute(toolName, input)`, `getDefinitions()`
- Mỗi tool implement interface:
  ```typescript
  export interface AgentTool {
    definition: ToolDefinition;
    execute(input: Record<string, unknown>): Promise<string>;
  }
  ```

#### [NEW] [calculator.tool.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/tools/calculator.tool.ts)
- Tool tính toán: nhận `expression` (string) → tính kết quả → trả về string
- Dùng `Function` constructor hoặc eval an toàn

#### [NEW] [web-search.tool.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/tools/web-search.tool.ts)
- Tool tìm kiếm web **giả lập** (trả về dữ liệu mẫu cứng) — tránh cần API key bên ngoài
- Nhận `query` → trả về danh sách kết quả mẫu

#### [NEW] [file-reader.tool.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/tools/file-reader.tool.ts)
- Tool đọc nội dung file từ hệ thống — minh họa việc Agent tương tác với filesystem
- Nhận `filePath` → trả về nội dung file (giới hạn ở thư mục `agentic-workflows/data/`)

---

### Component 4: Agent Core (Vòng lặp Plan → Execute → Verify)

#### [NEW] [conversation-memory.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/memory/conversation-memory.ts)
- Lưu trữ lịch sử messages (user, assistant, tool results)
- Lưu trữ plan hiện tại (danh sách steps, trạng thái từng step)
- Method: `addMessage()`, `getMessages()`, `getPlan()`, `updateStepStatus()`

#### [NEW] [planner.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/agent/planner.ts)
- **Bước PLAN**: Gửi task + system prompt cho LLM
- System prompt yêu cầu LLM trả về JSON array gồm các steps:
  ```json
  {
    "steps": [
      { "id": 1, "description": "Tìm thông tin X", "tool": "web_search", "reasoning": "..." },
      { "id": 2, "description": "Tính toán Y", "tool": "calculator", "reasoning": "..." },
      { "id": 3, "description": "Tổng hợp kết quả", "tool": null, "reasoning": "..." }
    ]
  }
  ```
- Có retry logic nếu LLM trả về JSON không hợp lệ

#### [NEW] [executor.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/agent/executor.ts)
- **Bước EXECUTE**: Nhận một step từ plan
- Gửi step description + context (kết quả các step trước) cho LLM kèm theo tools
- LLM sẽ quyết định gọi tool nào, với tham số gì
- Executor thực thi tool qua `ToolRegistry.execute()` và trả kết quả về

#### [NEW] [verifier.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/agent/verifier.ts)
- **Bước VERIFY**: Gửi kết quả step vừa thực thi cho LLM
- LLM đánh giá: step đã hoàn thành tốt chưa? Cần retry không? Cần điều chỉnh plan không?
- Trả về enum: `SUCCESS` | `RETRY` | `REPLAN`

#### [NEW] [agent-loop.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/agent/agent-loop.ts)
- **Vòng lặp chính** kết hợp tất cả:
  ```
  1. Nhận task từ user
  2. PLAN: Gọi Planner → nhận danh sách steps
  3. Với mỗi step:
     a. EXECUTE: Gọi Executor → nhận kết quả
     b. VERIFY: Gọi Verifier → đánh giá
     c. Nếu RETRY → quay lại 3a (tối đa 2 lần)
     d. Nếu REPLAN → quay lại bước 2
     e. Nếu SUCCESS → chuyển sang step tiếp theo
  4. Tổng hợp kết quả cuối cùng → trả lời user
  ```
- `maxIterations` để tránh lặp vô hạn (mặc định: 10)
- Log chi tiết từng bước ra console (có màu sắc) để dễ theo dõi

---

### Component 5: Entry Point

#### [NEW] [main.ts](file:///e:/Hoc-tap/WebStormProject/week3_advanced_ai_satefy/agentic-workflows/src/main.ts)
- Đọc biến môi trường từ `.env`
- Khởi tạo provider (local hoặc frontier) dựa trên `PROVIDER`
- Đăng ký tools vào registry
- Khởi tạo Agent Loop
- Chạy CLI đơn giản (readline) cho user nhập task
- In ra từng bước Plan → Execute → Verify với **màu sắc** và **emoji** để dễ theo dõi:
  ```
  🎯 Task: "Tìm dân số Việt Nam rồi tính GDP per capita nếu GDP là 430 tỷ USD"
  
  📋 PLAN (3 steps):
    Step 1: Tìm dân số Việt Nam → tool: web_search
    Step 2: Tính GDP per capita  → tool: calculator  
    Step 3: Tổng hợp câu trả lời → tool: none
  
  ⚡ EXECUTE Step 1: Gọi web_search("dân số Việt Nam")...
    → Kết quả: "Dân số Việt Nam khoảng 100 triệu người"
  ✅ VERIFY Step 1: SUCCESS
  
  ⚡ EXECUTE Step 2: Gọi calculator("430000000000 / 100000000")...
    → Kết quả: "4300"
  ✅ VERIFY Step 2: SUCCESS
  
  ⚡ EXECUTE Step 3: Tổng hợp...
  ✅ VERIFY Step 3: SUCCESS
  
  🏁 FINAL ANSWER: GDP per capita của Việt Nam là khoảng 4,300 USD/người.
  ```

---

## Verification Plan

### Automated Tests
1. **Chạy với Local Model (LM Studio)**:
   ```bash
   # Đảm bảo LM Studio đang chạy với model qwen-3.5-9b (hoặc gemma-4-e4b, rnj-1)
   npm start
   # Nhập task test: "Tính 15 * 37 + 200 / 4"
   # Kiểm tra Agent có plan ra các steps hợp lý và gọi calculator tool
   ```

2. **Chạy với Frontier Model (z.ai)**:
   ```bash
   # Đặt PROVIDER=frontier trong .env, điền ZAI_API_KEY
   npm start
   # Nhập task test tương tự
   ```

3. **Test multi-step tool chain**: 
   - Nhập task: "Tìm dân số Việt Nam và tính GDP per capita nếu GDP là 430 tỷ USD"
   - Kiểm tra Agent gọi `web_search` → lấy dân số → gọi `calculator` → tính toán

4. **Test verify + retry**:
   - Kiểm tra khi tool trả lỗi (ví dụ file không tồn tại), Agent có verify RETRY và thử lại không

5. **Test chuyển đổi model**:
   - Đổi `LOCAL_MODEL` trong `.env` lần lượt sang `gemma-4-e4b`, `qwen-3.5-9b`, `rnj-1` → chạy lại → so sánh chất lượng reasoning

### Manual Verification
- Đọc log console để đảm bảo luồng Plan → Execute → Verify hiển thị rõ ràng với emoji và màu sắc
- So sánh kết quả giữa LM Studio (local) vs z.ai (frontier)
