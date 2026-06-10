export abstract class BaseProvider {
  name: string;
  model: string;

  constructor(name: string, model: string) {
    this.name = name;
    this.model = model;
  }

  /**
   * Sinh ra câu trả lời dựa trên list các message.
   */
  abstract complete(messages: any[], options?: any): Promise<string>;

  /**
   * Gọi thử một query ngắn để check API Key/Base URL xem kết nối có ok không.
   */
  abstract healthCheck(): Promise<boolean>;
}
