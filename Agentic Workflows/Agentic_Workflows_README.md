# Agentic Workflows (Luồng công việc của Agent)

**Agentic Workflows** đề cập đến các hệ thống mà ở đó AI (như các mô hình ngôn ngữ lớn - LLM) không chỉ đơn thuần là phản hồi các câu hỏi một cách thụ động, mà còn có khả năng tự chủ hoạt động như một "đại lý" (agent). Các agent này có thể tự động lập kế hoạch, sử dụng các công cụ (tools), truy cập thông tin, và tương tác với môi trường để hoàn thành các mục tiêu phức tạp mà người dùng đề ra. Thay vì một yêu cầu nhận lại một câu trả lời duy nhất, Agentic Workflows cho phép quá trình tương tác diễn ra liên tục, tự sửa lỗi và điều chỉnh cho đến khi đạt kết quả.

---

## 1. Vòng lặp Plan → Execute → Verify (Lập kế hoạch → Thực thi → Xác minh)

Đây là cơ chế cốt lõi giúp các AI Agent hoạt động độc lập và hiệu quả, đảm bảo tính chính xác cho các tác vụ phức tạp.

- **Plan (Lập kế hoạch):** 
  Khi nhận được một yêu cầu phức tạp từ người dùng, Agent sẽ không thực hiện ngay mà sẽ "suy nghĩ" và phân rã (break down) yêu cầu đó thành các bước nhỏ, dễ quản lý hơn. Quá trình này tạo ra một lộ trình hành động rõ ràng.
- **Execute (Thực thi):** 
  Agent tiến hành thực hiện từng bước trong kế hoạch. Trong quá trình này, nó có thể gọi các công cụ (API, chạy mã code, tìm kiếm web, đọc/ghi file) để thu thập dữ liệu hoặc thực hiện các hành động cần thiết.
- **Verify (Xác minh/Đánh giá):** 
  Sau khi thực thi một bước (hoặc toàn bộ kế hoạch), Agent sẽ kiểm tra lại kết quả xem có đạt yêu cầu hay không, có sinh ra lỗi không. Nếu có lỗi hoặc kết quả chưa đạt, nó sẽ quay lại bước Plan để điều chỉnh kế hoạch và thử lại. Vòng lặp này lặp đi lặp lại cho đến khi tác vụ hoàn tất thành công.

---

## 2. Multi-step Tool Chains (Chuỗi công cụ nhiều bước)

Để giải quyết các vấn đề trong thế giới thực, Agent thường không chỉ dùng một công cụ. **Multi-step Tool Chains** là khả năng kết nối nhiều công cụ khác nhau lại theo một chuỗi logic để đạt được mục tiêu cuối cùng.

**Ví dụ:**
- *Bước 1:* Dùng công cụ `Web Search` để tìm tài liệu về một công nghệ mới.
- *Bước 2:* Dùng công cụ `Read Webpage` để trích xuất nội dung của các trang web vừa tìm được.
- *Bước 3:* Dùng mô hình AI để tóm tắt nội dung trích xuất.
- *Bước 4:* Dùng công cụ `Write File` để lưu bản tóm tắt vào một file `.md` trong máy tính của người dùng.

Đầu ra của công cụ này sẽ trở thành đầu vào (context) cho công cụ tiếp theo.

---

## 3. Triển khai Agent phân rã các tác vụ phức tạp thành nhiều bước

Việc xây dựng (implement) một Agent có khả năng phân rã (break down) các tác vụ phức tạp thường đòi hỏi sự kết hợp giữa **Prompt Engineering** (cung cấp hướng dẫn rõ ràng cho LLM) và **Architecture** (kiến trúc code).

### Các thành phần chính khi thiết kế:

1. **System Prompt (Hướng dẫn cốt lõi):**
   Bạn cần định nghĩa rõ vai trò của LLM: *"Bạn là một AI Agent tự chủ. Khi nhận được một yêu cầu, KHÔNG được làm ngay. Hãy liệt kê ra 3-5 bước nhỏ cần thiết để giải quyết vấn đề. Sau đó thực thi từng bước một."*

2. **Memory (Bộ nhớ ngữ cảnh):**
   Agent cần có bộ nhớ ngắn hạn để ghi nhớ:
   - Mục tiêu ban đầu là gì?
   - Các bước nào đã hoàn thành? Kết quả ra sao?
   - Các bước nào chưa làm?

3. **Tool Calling / Function Calling (Cơ chế gọi hàm):**
   Agent phải có khả năng hiểu cấu trúc của các tools (như search, calculator, file_writer) và quyết định khi nào thì truyền tham số vào để kích hoạt một tool cụ thể thay vì chỉ sinh ra văn bản trả lời.

4. **Kiến trúc vòng lặp điều khiển (Control Loop):**
   Trong mã nguồn ứng dụng, bạn sẽ thiết lập một vòng lặp (như `while`). Hoàn toàn **CÓ THỂ** thực hiện hệ thống Agentic Workflows bằng **TypeScript** (thông qua LangChain.js, LangGraph.js, hoặc dùng trực tiếp SDK như `@google/genai`).

   Dưới đây là một ví dụ minh họa cách thiết lập vòng lặp Plan → Execute → Verify bằng **TypeScript** (sử dụng LangChain.js):

   ```typescript
   import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
   import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";

   async function runAgenticWorkflow(userPrompt: string) {
       // 1. Khởi tạo LLM và danh sách các Tools (Công cụ)
       const llm = new ChatGoogleGenerativeAI({ modelName: "gemini-pro" });
       const tools = [new WebSearchTool(), new FileWriterTool()];
       
       // 2. Tạo Agent (hệ thống suy nghĩ, lập kế hoạch và quyết định tool)
       const agent = await createStructuredChatAgent({ llm, tools, prompt: systemPrompt });
       
       // 3. Khởi tạo Executor (Đóng vai trò là vòng lặp điều khiển - Control Loop)
       const agentExecutor = new AgentExecutor({ 
           agent, 
           tools, 
           maxIterations: 5, // Tránh lặp vô hạn
           returnIntermediateSteps: true // Theo dõi các bước Execute & Verify
       });
       
       // 4. Bắt đầu vòng lặp Plan -> Execute -> Verify
       // Executor sẽ tự động phân rã task, gọi tools, nạp kết quả vào ngữ cảnh, 
       // và lặp lại cho đến khi hoàn thành mục tiêu.
       const result = await agentExecutor.invoke({ input: userPrompt });
       
       console.log("Kết quả cuối cùng:", result.output);
   }
   ```

### Lợi ích:
Việc ép Agent phải "chia nhỏ và chinh phục" (divide and conquer) giúp giảm thiểu hiện tượng ảo giác (hallucination) của AI, dễ dàng debug xem AI đang sai ở bước nào, và cho phép giải quyết những bài toán mà bản thân LLM không thể làm được trong một lần sinh text duy nhất.

---

## 4. Lựa chọn Model: Frontier Models (API) vs Local Models

Khi xây dựng Agentic Workflows, khả năng **suy luận logic (reasoning)** và **sử dụng công cụ (tool calling / function calling)** của model là yếu tố sinh tử. Dưới đây là phân tích để bạn lựa chọn:

### A. Frontier Models qua API (Gemini 1.5 Pro, GPT-4o, Claude 3.5 Sonnet)
Đây là lựa chọn **KHUYÊN DÙNG NHẤT** cho Agentic Workflows ở thời điểm hiện tại.

- **Ưu điểm:**
  - **Khả năng Lập kế hoạch & Xác minh cực tốt:** Chúng hiếm khi bị kẹt trong vòng lặp vô tận vì nhận thức được mình đã làm sai ở đâu để sửa lại.
  - **Độ chính xác của Tool Calling cao:** Output ra JSON chuẩn xác, truyền tham số cho các API rất ít khi bị lỗi cú pháp.
  - **Cửa sổ ngữ cảnh (Context Window) lớn:** Giúp lưu trữ nhiều lịch sử giao tiếp giữa các tool (ví dụ Gemini 1.5 Pro hỗ trợ lên đến 2M token).
- **Nhược điểm:** Tốn chi phí trả theo token, phụ thuộc vào kết nối mạng, và có thể gặp vấn đề về bảo mật dữ liệu doanh nghiệp (data privacy).

### B. Local Models (Llama 3, Mistral, Qwen chạy qua Ollama / LM Studio)
Phù hợp cho các doanh nghiệp cần **bảo mật tuyệt đối** hoặc chạy offline.

- **Ưu điểm:** Miễn phí API, kiểm soát hoàn toàn dữ liệu (không gửi ra ngoài Internet).
- **Nhược điểm lớn:**
  - **Dễ bị "ngu" ở bước Verify:** Các model nhỏ thường không đủ khả năng đánh giá lại xem kết quả tool trả về đã giải quyết được vấn đề chưa, dẫn đến lặp lại một hành động liên tục.
  - **Format lỗi:** Rất hay trả về JSON bị hỏng (malformed) khi gọi tool, đòi hỏi bạn phải viết code xử lý bắt lỗi (fallback / retry) rất phức tạp.
  - Để chạy ổn định Agentic Workflows, bạn cần dùng các bản model lớn (như Llama-3-70B), đòi hỏi phần cứng GPU siêu đắt tiền.

### 💡 Lời khuyên (Best Practice)
1. **Giai đoạn phát triển (PoC):** Luôn dùng **Frontier Models** để xây dựng kiến trúc Agent, viết prompt, và kiểm tra tính khả thi của hệ thống trước. Đừng dùng Local Model lúc đầu vì bạn sẽ không biết lỗi do kiến trúc code của bạn hay do model quá kém.
2. **Giai đoạn tối ưu:** Khi mọi thứ đã chạy trơn tru với API, bạn mới nên thử thay bằng các **Local Models chuyên biệt cho function calling** (ví dụ: Hermes-Function-Calling) và thêm các lớp bắt lỗi để xem hệ thống còn giữ được độ ổn định không.
