import type { AgentTool } from "./tool-registry.js";

const MOCK_RESULTS = [
  {
    keywords: ["dân số việt nam", "dan so viet nam", "population vietnam", "vietnam population"],
    result: "Dữ liệu mẫu: Dân số Việt Nam khoảng 100 triệu người. Nguồn giả lập dùng cho demo agentic workflow."
  },
  {
    keywords: ["gdp việt nam", "gdp vietnam", "kinh tế việt nam"],
    result: "Dữ liệu mẫu: GDP Việt Nam có thể được nhập bởi user, ví dụ 430 tỷ USD trong bài test."
  },
  {
    keywords: ["agentic workflow", "plan execute verify", "ai agent"],
    result: "Dữ liệu mẫu: Agentic workflow thường gồm các bước lập kế hoạch, thực thi bằng tool, xác minh, rồi lặp lại khi cần."
  }
];

export class WebSearchTool implements AgentTool {
  definition = {
    name: "web_search",
    description: "Search a small mocked knowledge base. Use this when a step needs external-looking information for the demo.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query."
        }
      },
      required: ["query"],
      additionalProperties: false
    }
  };

  async execute(input: Record<string, unknown>): Promise<string> {
    const query = String(input.query ?? "").trim();
    if (!query) {
      throw new Error("web_search requires a query.");
    }

    const normalizedQuery = query.toLocaleLowerCase("vi-VN");
    const matched = MOCK_RESULTS.find((entry) =>
      entry.keywords.some((keyword) => normalizedQuery.includes(keyword.toLocaleLowerCase("vi-VN")))
    );

    return matched?.result ?? `Dữ liệu mẫu: Không có kết quả khớp chính xác cho "${query}". Hãy dùng thông tin user cung cấp hoặc thử query khác.`;
  }
}
