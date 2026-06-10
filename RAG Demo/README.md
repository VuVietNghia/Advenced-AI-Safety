# RAG Basic Demo

Demo đầy đủ về **Retrieval-Augmented Generation (RAG)** sử dụng:
- 🤖 **nomic-embed-text-v1.5** chạy local qua LM Studio
- 📐 **Cosine Similarity** (tự implement, không dùng thư viện)
- ✂️ **3 Chiến lược Chunking**: Fixed-size, Sentence, Recursive
- 💾 **In-memory Vector Store** với JSON persistence

## Yêu cầu

1. **LM Studio** đang chạy với model `nomic-embed-text-v1.5` được load
2. Local Server bật ở port **1234**
3. Node.js >= 18

## Cài đặt

```bash
npm install
```

## Chạy Demo

### Bước 1: Index tài liệu (Pha 1 - Data Ingestion)
```bash
npm run index
```
- Load 6 tài liệu mẫu về AI/RAG
- Chia thành chunks với 3 chiến lược
- Tạo embedding vector cho mỗi chunk
- Lưu vào `vector_store.json`

### Bước 2: Interactive Demo (Full Pipeline)
```bash
npm run demo
```
Demo tương tác gồm 4 phần:
1. **Chunking Strategies**: So sánh 3 cách chia văn bản
2. **Embeddings**: Visualize vectors và cosine similarity
3. **Vector Store**: Build và thống kê
4. **Retrieval**: Tìm kiếm ngữ nghĩa theo câu hỏi

### Bước 3: Query nhanh (Pha 2 - Retrieval)
```bash
npm run query "RAG là gì?"
npm run query "Cosine similarity tính như thế nào?"
npm run query "Cách dùng LM Studio?"
```

## Kiến trúc

```
User Query
    ↓
[Embed Query]  ──→  query_vector (768D)
    ↓
[Cosine Similarity]  ──→  score với mỗi entry trong store
    ↓
[Sort & Top-K]  ──→  Top 5 chunks có score cao nhất
    ↓
Retrieved Context
```

## Files

| File | Mô tả |
|------|-------|
| `src/types.ts` | Shared TypeScript interfaces |
| `src/embedder.ts` | Gọi LM Studio API để tạo embeddings |
| `src/chunker.ts` | 3 chiến lược chunking |
| `src/vectorStore.ts` | In-memory store + Cosine Similarity |
| `src/indexer.ts` | Pha 1: Documents → Chunks → Vectors |
| `src/retriever.ts` | Pha 2: Query → Search → Results |
| `src/demo.ts` | Interactive CLI demo |
| `src/data/documents.ts` | 6 tài liệu mẫu tiếng Việt |
