import readline from "readline";
import { chat } from "./chatbot.js";
import { initIndex } from "./embedding/store.js";

async function main() {
  await initIndex();
  console.log("RAG Chatbot ready. Type your question (Ctrl+C to exit).\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = () => {
    rl.question("You: ", async (input) => {
      const query = input.trim();
      if (!query) {
        ask();
        return;
      }

      try {
        const result = await chat(query);

        if (result.blocked) {
          console.log(`\n[BLOCKED] ${result.answer}\n`);
        } else {
          console.log(`\nBot: ${result.answer}`);
          console.log(`Sources: ${result.sources.join(", ") || "none"}`);
          console.log(`Confidence: ${result.confidence}\n`);
        }
      } catch (err) {
        console.error("[error]", err);
      }

      ask();
    });
  };

  ask();
}

main().catch(console.error);
