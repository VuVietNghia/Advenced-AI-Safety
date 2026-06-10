import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { AgentLoop } from "./agent/agent-loop.js";
import { config, validateConfig } from "./config.js";
import { ConversationMemory } from "./memory/conversation-memory.js";
import { FrontierProvider } from "./providers/frontier-provider.js";
import type { LLMProvider } from "./providers/types.js";
import { LocalProvider } from "./providers/local-provider.js";
import { CalculatorTool } from "./tools/calculator.tool.js";
import { FileReaderTool } from "./tools/file-reader.tool.js";
import { ToolRegistry } from "./tools/tool-registry.js";
import { WebSearchTool } from "./tools/web-search.tool.js";

async function main(): Promise<void> {
  validateConfig(config);

  const provider = createProvider();
  const tools = createTools();
  const memory = new ConversationMemory();
  const agent = new AgentLoop(provider, tools, memory);
  const taskFromArgs = process.argv.slice(2).join(" ").trim();

  console.log(`Provider: ${config.provider}`);
  console.log(`Tools: ${tools.getToolNames().join(", ")}`);

  if (taskFromArgs) {
    await agent.run(taskFromArgs);
    return;
  }

  const rl = readline.createInterface({ input, output });
  try {
    while (true) {
      const task = (await rl.question("\nNhập task cho agent (hoặc 'exit'): ")).trim();
      if (!task || task.toLocaleLowerCase("vi-VN") === "exit") {
        break;
      }

      await agent.run(task);
    }
  } finally {
    rl.close();
  }
}

function createProvider(): LLMProvider {
  if (config.provider === "frontier") {
    return new FrontierProvider(config.frontier.apiKey, config.frontier.model, config.frontier.baseUrl);
  }

  return new LocalProvider(config.local.baseUrl, config.local.model);
}

function createTools(): ToolRegistry {
  const registry = new ToolRegistry();
  registry.register(new CalculatorTool());
  registry.register(new WebSearchTool());
  registry.register(new FileReaderTool(process.cwd()));
  return registry;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error: ${message}`);
  process.exitCode = 1;
});
