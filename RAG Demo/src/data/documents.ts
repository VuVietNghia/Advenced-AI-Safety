// ============================================================
//  DỮ LIỆU MẪU - Các tài liệu tiếng Việt về AI và Công nghệ
//  Đây là "Knowledge Base" mà RAG sẽ tìm kiếm trong đó
// ============================================================

import type { Document } from '../types.js';

export const SAMPLE_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    title: 'Trí Tuệ Nhân Tạo Là Gì?',
    category: 'AI Cơ Bản',
    content: `Trí tuệ nhân tạo (AI - Artificial Intelligence) là lĩnh vực khoa học máy tính tập trung vào việc tạo ra các hệ thống có khả năng thực hiện các nhiệm vụ thường đòi hỏi trí thông minh của con người. Các nhiệm vụ này bao gồm nhận dạng giọng nói, học hỏi, lập kế hoạch, giải quyết vấn đề và nhận thức ngôn ngữ tự nhiên.

AI được chia thành hai loại chính: AI hẹp (Narrow AI) và AI tổng quát (General AI). AI hẹp được thiết kế để thực hiện một nhiệm vụ cụ thể, như nhận dạng khuôn mặt hoặc chơi cờ vua. Trong khi đó, AI tổng quát có thể thực hiện bất kỳ nhiệm vụ trí tuệ nào mà con người có thể làm được.

Các ứng dụng phổ biến của AI trong cuộc sống ngày nay bao gồm trợ lý ảo như Siri và Google Assistant, hệ thống gợi ý sản phẩm của Netflix và Amazon, xe tự lái, chẩn đoán bệnh trong y tế, và dịch thuật ngôn ngữ tự động.

Machine Learning (Học máy) là một nhánh quan trọng của AI, cho phép máy tính học từ dữ liệu mà không cần lập trình rõ ràng. Thay vì viết các quy tắc cụ thể, chúng ta cung cấp dữ liệu cho mô hình và để nó tự tìm ra các mẫu và quy luật.

Deep Learning (Học sâu) là một nhánh con của Machine Learning, sử dụng mạng nơ-ron nhân tạo nhiều tầng để học các biểu diễn phân cấp của dữ liệu. Đây là nền tảng của nhiều đột phá AI hiện đại như ChatGPT và DALL-E.`,
  },
  {
    id: 'doc-002',
    title: 'RAG - Retrieval Augmented Generation',
    category: 'AI Nâng Cao',
    content: `RAG (Retrieval Augmented Generation) là một kỹ thuật kết hợp khả năng tìm kiếm thông tin với khả năng sinh văn bản của các mô hình ngôn ngữ lớn (LLM). Đây là giải pháp hiệu quả để khắc phục vấn đề "ảo giác" (hallucination) của LLM.

Kiến trúc RAG gồm hai giai đoạn chính. Giai đoạn đầu tiên là Indexing (lập chỉ mục): tài liệu được chia nhỏ thành các chunks, sau đó mỗi chunk được chuyển thành vector embedding và lưu vào vector database. Giai đoạn thứ hai là Retrieval & Generation (truy xuất và sinh văn bản): khi người dùng đặt câu hỏi, câu hỏi cũng được chuyển thành vector, sau đó so sánh với các vector trong database để tìm ra các đoạn thông tin liên quan nhất, cuối cùng các đoạn này được đưa vào prompt cho LLM để sinh ra câu trả lời.

Ưu điểm của RAG so với fine-tuning: RAG không cần train lại mô hình, dễ cập nhật kiến thức mới, chi phí thấp hơn nhiều, và có thể kiểm soát nguồn thông tin. RAG đặc biệt hữu ích cho các ứng dụng chatbot doanh nghiệp, hệ thống hỏi đáp tài liệu, và trợ lý pháp lý hay y tế.

Các thách thức của RAG bao gồm: chất lượng chunking ảnh hưởng trực tiếp đến kết quả, embedding model cần phải phù hợp với ngôn ngữ và lĩnh vực, và việc xếp hạng (ranking) các kết quả tìm kiếm cần được tối ưu.`,
  },
  {
    id: 'doc-003',
    title: 'Vector Database và Embeddings',
    category: 'AI Nâng Cao',
    content: `Vector database là loại cơ sở dữ liệu đặc biệt được thiết kế để lưu trữ và tìm kiếm các vector số chiều cao một cách hiệu quả. Khác với database truyền thống tìm kiếm theo từ khóa chính xác, vector database tìm kiếm theo sự tương đồng ngữ nghĩa.

Embeddings là các vector số đại diện cho ý nghĩa của văn bản trong không gian toán học nhiều chiều. Ví dụ, câu "Tôi yêu chó" và "Tôi thích nuôi thú cưng" sẽ có embeddings nằm gần nhau trong không gian vector, vì chúng có ý nghĩa tương tự nhau.

Quá trình tạo embedding: văn bản đầu vào được đưa vào embedding model (như nomic-embed-text, text-embedding-ada-002, hoặc sentence-transformers), mô hình xử lý văn bản qua nhiều tầng transformer và tạo ra một vector số chiều cao (thường 384, 768, hoặc 1536 chiều).

Cosine similarity là phép đo phổ biến nhất để so sánh hai vector embedding. Công thức: cos(θ) = (A·B) / (|A| × |B|). Kết quả từ -1 đến 1, trong đó 1 nghĩa là hoàn toàn giống nhau, 0 nghĩa là không liên quan, và -1 nghĩa là trái ngược nhau.

Các vector database phổ biến gồm: Pinecone (cloud-based, fully managed), Weaviate (open-source, hỗ trợ nhiều tính năng), Qdrant (open-source, viết bằng Rust, rất nhanh), ChromaDB (đơn giản, phù hợp prototype), và FAISS của Facebook (library, không phải database đầy đủ). Mỗi loại có ưu nhược điểm riêng tùy theo quy mô và yêu cầu của dự án.`,
  },
  {
    id: 'doc-004',
    title: 'Chiến Lược Chunking Văn Bản',
    category: 'RAG Kỹ Thuật',
    content: `Chunking là quá trình chia nhỏ tài liệu lớn thành các đoạn nhỏ hơn (chunks) trước khi tạo embeddings. Đây là một trong những bước quan trọng nhất ảnh hưởng đến chất lượng của hệ thống RAG.

Fixed-size chunking (Chia theo kích thước cố định) là cách đơn giản nhất: chia văn bản thành các chunk có số ký tự bằng nhau. Ví dụ, chunk_size=500 và overlap=50 nghĩa là mỗi chunk dài 500 ký tự, và chunk sau bắt đầu từ ký tự thứ 450 của chunk trước. Overlap giúp tránh mất ngữ cảnh ở ranh giới giữa các chunk.

Sentence chunking (Chia theo câu) chia văn bản tại các dấu câu như dấu chấm, dấu chấm than, dấu hỏi. Cách này đảm bảo mỗi chunk chứa các câu hoàn chỉnh, giúp ý nghĩa không bị cắt đứt giữa chừng.

Recursive character text splitting là phương pháp phổ biến nhất, được sử dụng trong LangChain. Nó chia văn bản theo thứ tự ưu tiên: đầu tiên thử chia theo đoạn văn (\\n\\n), nếu vẫn còn quá dài thì chia theo dòng (\\n), rồi theo câu (. ), và cuối cùng theo từng ký tự.

Semantic chunking là phương pháp tiên tiến nhất, sử dụng embeddings để phát hiện điểm chuyển chủ đề trong văn bản. Khi độ tương đồng cosine giữa hai câu liền kề giảm đột ngột xuống dưới ngưỡng threshold, đó là điểm chia chunk. Phương pháp này cho chất lượng tốt nhất nhưng đòi hỏi tài nguyên tính toán nhiều hơn.

Lựa chọn chunk size phụ thuộc vào nhiều yếu tố: context window của LLM (GPT-4 hỗ trợ 128K tokens), độ dài trung bình của câu hỏi người dùng, và cấu trúc của tài liệu nguồn. Chunk quá nhỏ mất ngữ cảnh, chunk quá lớn làm giảm độ chính xác tìm kiếm.`,
  },
  {
    id: 'doc-005',
    title: 'LM Studio và Mô Hình Local',
    category: 'Công Cụ AI',
    content: `LM Studio là ứng dụng desktop cho phép chạy các mô hình ngôn ngữ lớn (LLM) hoàn toàn trên máy tính cá nhân mà không cần kết nối internet. Đây là lựa chọn tuyệt vời cho những ai quan tâm đến quyền riêng tư hoặc muốn thực nghiệm với AI mà không tốn chi phí API.

LM Studio hỗ trợ chuẩn OpenAI API, nghĩa là bạn có thể sử dụng bất kỳ code nào được viết cho OpenAI API chỉ bằng cách thay đổi base URL từ "https://api.openai.com/v1" sang "http://localhost:1234/v1". Điều này giúp migration cực kỳ dễ dàng.

nomic-embed-text-v1.5 là một embedding model mạnh mẽ, mã nguồn mở, được thiết kế đặc biệt cho các tác vụ tìm kiếm ngữ nghĩa và RAG. Mô hình này tạo ra các vector 768 chiều và hỗ trợ đa ngôn ngữ, bao gồm cả tiếng Việt. So với text-embedding-ada-002 của OpenAI, nomic-embed-text cho chất lượng tương đương nhưng hoàn toàn miễn phí và chạy local.

Để sử dụng LM Studio cho RAG: tải LM Studio, tìm kiếm và tải model nomic-embed-text-v1.5, khởi động Local Server trong tab "Local Server", đảm bảo server chạy trên port 1234. Sau đó trong code TypeScript, tạo OpenAI client với baseURL: "http://localhost:1234/v1" và apiKey: "lm-studio" (bất kỳ string nào).

Các model embedding phổ biến trên LM Studio: nomic-embed-text-v1.5 (recommended), mxbai-embed-large-v1 (tốt hơn cho tiếng Anh), và multilingual-e5-large (tốt nhất cho đa ngôn ngữ).`,
  },
  {
    id: 'doc-006',
    title: 'Prompt Engineering và Context Window',
    category: 'AI Kỹ Thuật',
    content: `Prompt Engineering là nghệ thuật thiết kế các câu lệnh (prompts) hiệu quả để hướng dẫn LLM tạo ra đầu ra mong muốn. Đây là kỹ năng quan trọng khi làm việc với bất kỳ hệ thống AI nào.

Context window là giới hạn tổng số token mà một LLM có thể xử lý trong một lần. Ví dụ, GPT-4 có context window 128K tokens, Claude 3 có 200K tokens. Trong RAG, ta cần cân bằng giữa số lượng chunks retrieved (để có đủ thông tin) và kích thước mỗi chunk (để không vượt quá context window).

System prompt trong RAG thường bao gồm: hướng dẫn về vai trò của AI, yêu cầu chỉ trả lời dựa trên context được cung cấp, cách xử lý khi không tìm thấy thông tin, và format mong muốn của câu trả lời.

Few-shot prompting là kỹ thuật cung cấp một số ví dụ (examples) trong prompt để hướng dẫn LLM theo cách trả lời mong muốn. Ví dụ, cho LLM thấy 3 cặp câu hỏi-trả lời mẫu trước khi hỏi câu hỏi thực sự.

Chain-of-thought prompting yêu cầu LLM giải thích từng bước suy luận trước khi đưa ra câu trả lời cuối cùng. Kỹ thuật này cải thiện đáng kể độ chính xác cho các bài toán phức tạp đòi hỏi nhiều bước logic.

Trong hệ thống RAG production, prompt thường được cấu trúc như sau: [System Prompt] + [Retrieved Context] + [User Question] + [Answer Format Instructions]. Việc sắp xếp thứ tự này giúp LLM ưu tiên sử dụng thông tin từ context trước khi dùng kiến thức nội tại.`,
  },
];
