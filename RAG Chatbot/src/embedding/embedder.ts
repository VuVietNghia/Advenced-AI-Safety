import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({
  baseURL: process.env.LMSTUDIO_BASE_URL!,
  apiKey: process.env.LMSTUDIO_API_KEY!, // Required even if unused by LM Studio
});

export async function embedText(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: process.env.LMSTUDIO_EMBED_MODEL!,
    input: text,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[], batchSize = 100): Promise<number[][]> {
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await client.embeddings.create({
      model: process.env.LMSTUDIO_EMBED_MODEL!,
      input: batch,
      encoding_format: "float",
    });
    allEmbeddings.push(...response.data.map((item) => item.embedding));
  }

  return allEmbeddings;
}
