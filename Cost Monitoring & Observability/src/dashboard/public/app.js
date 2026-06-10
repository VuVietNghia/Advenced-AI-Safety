const providerSelect = document.querySelector("#provider-select");
const lmModelField = document.querySelector("#lm-model-field");
const zhipuModelField = document.querySelector("#zhipu-model-field");
const lmModelInput = document.querySelector("#lm-model-input");
const zhipuModelSelect = document.querySelector("#zhipu-model-select");
const chatWindow = document.querySelector("#chat-window");
const chatForm = document.querySelector("#chat-form");
const promptInput = document.querySelector("#prompt-input");
const sendButton = document.querySelector("#send-button");
const chatView = document.querySelector("#view-chat");
const dashboardView = document.querySelector("#view-dashboard");
const chatTab = document.querySelector("#btn-chat");
const dashboardTab = document.querySelector("#btn-dashboard");
const recentTable = document.querySelector("#recent-table");

let tokensChart;
let latencyChart;
let providerChart;

function switchView(view) {
  const showChat = view === "chat";
  chatView.hidden = !showChat;
  dashboardView.hidden = showChat;
  chatTab.classList.toggle("active", showChat);
  dashboardTab.classList.toggle("active", !showChat);
}

function updateModelSelector(provider) {
  const isLmStudio = provider === "LM_STUDIO";
  lmModelField.hidden = !isLmStudio;
  zhipuModelField.hidden = isLmStudio;
}

function selectedModel() {
  return providerSelect.value === "LM_STUDIO"
    ? lmModelInput.value.trim() || "local-model"
    : zhipuModelSelect.value;
}

function ensureEmptyState() {
  if (chatWindow.children.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-chat";
    empty.textContent =
      "Send a prompt to record token usage, latency, cost, and errors automatically.";
    chatWindow.append(empty);
  }
}

function clearEmptyState() {
  const empty = chatWindow.querySelector(".empty-chat");
  if (empty) {
    empty.remove();
  }
}

function addBubble(role, content, options = {}) {
  clearEmptyState();
  const row = document.createElement("div");
  row.className = `message-row ${role}${options.error ? " error" : ""}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const text = document.createElement("div");
  text.textContent = content;
  if (options.loading) {
    text.className = "loading-dots";
    text.textContent = "Thinking";
  }
  bubble.append(text);

  if (options.metrics) {
    bubble.append(createMetricsLine(options.metrics));
  }

  row.append(bubble);
  chatWindow.append(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return row;
}

function replaceBubble(row, content, metrics, isError) {
  row.className = `message-row ai${isError ? " error" : ""}`;
  const bubble = row.querySelector(".bubble");
  bubble.replaceChildren();

  const text = document.createElement("div");
  text.textContent = content;
  bubble.append(text);

  if (metrics) {
    bubble.append(createMetricsLine(metrics));
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function createMetricsLine(metrics) {
  const line = document.createElement("div");
  line.className = "metrics-line";
  line.textContent = `${metrics.latencyMs}ms | ${metrics.totalTokens} tokens | ${formatCost(metrics)}`;
  return line;
}

function formatCost(metrics) {
  if (metrics.estimatedCostUSD === null || metrics.estimatedCostUSD === undefined) {
    return "N/A";
  }

  return `$${Number(metrics.estimatedCostUSD).toFixed(6)}`;
}

async function sendMessage() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    return;
  }

  addBubble("user", prompt);
  const loadingRow = addBubble("ai", "", { loading: true });
  promptInput.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "Sending";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        provider: providerSelect.value,
        model: selectedModel()
      })
    });
    const payload = await response.json();

    if (!payload.metrics) {
      throw new Error(payload.error || "Chat request failed.");
    }

    replaceBubble(
      loadingRow,
      payload.content,
      payload.metrics,
      payload.metrics.isError || !response.ok
    );
    fetchData();
  } catch (error) {
    replaceBubble(
      loadingRow,
      error instanceof Error ? error.message : String(error),
      null,
      true
    );
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
    promptInput.focus();
  }
}

function setText(selector, value) {
  document.querySelector(selector).textContent = value;
}

function numberFormat(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number(value) || 0));
}

function percentFormat(value) {
  return `${((Number(value) || 0) * 100).toFixed(1)}%`;
}

function updateCards(summary) {
  setText("#total-calls", numberFormat(summary.totalCalls));
  setText("#total-tokens", numberFormat(summary.totalTokens));
  setText("#total-cost", `$${Number(summary.totalEstimatedCostUSD || 0).toFixed(6)}`);
  setText("#error-rate", percentFormat(summary.errorRate));
}

function destroyChart(chart) {
  if (chart) {
    chart.destroy();
  }
}

function renderTokensChart(metrics) {
  const recent = [...metrics].reverse().slice(-30);
  const labels = recent.map((item) =>
    new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  );

  destroyChart(tokensChart);
  tokensChart = new Chart(document.querySelector("#tokens-chart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "LM Studio",
          data: recent.map((item) =>
            item.provider === "LM_STUDIO" ? item.totalTokens : null
          ),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.12)",
          spanGaps: true,
          tension: 0.25
        },
        {
          label: "ZhipuAI",
          data: recent.map((item) =>
            item.provider === "ZHIPU_API" ? item.totalTokens : null
          ),
          borderColor: "#047857",
          backgroundColor: "rgba(4, 120, 87, 0.12)",
          spanGaps: true,
          tension: 0.25
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderLatencyChart(models) {
  destroyChart(latencyChart);
  latencyChart = new Chart(document.querySelector("#latency-chart"), {
    type: "bar",
    data: {
      labels: models.map((item) => item.name),
      datasets: [
        {
          label: "Average ms",
          data: models.map((item) => Math.round(item.avgLatencyMs)),
          backgroundColor: "#f59e0b"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderProviderChart(providers) {
  destroyChart(providerChart);
  providerChart = new Chart(document.querySelector("#provider-chart"), {
    type: "doughnut",
    data: {
      labels: providers.map((item) => item.name),
      datasets: [
        {
          data: providers.map((item) => item.totalCalls),
          backgroundColor: ["#2563eb", "#047857", "#f59e0b", "#db2777"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

function renderRecentTable(metrics) {
  recentTable.replaceChildren();

  if (metrics.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = "No calls recorded yet.";
    row.append(cell);
    recentTable.append(row);
    return;
  }

  for (const item of metrics) {
    const row = document.createElement("tr");
    const values = [
      new Date(item.timestamp).toLocaleString(),
      item.provider,
      item.model,
      numberFormat(item.totalTokens),
      `${numberFormat(item.latencyMs)}ms`,
      formatCost(item)
    ];

    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }

    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = `status ${item.isError ? "error" : "ok"}`;
    status.textContent = item.isError ? "Error" : "OK";
    statusCell.append(status);
    row.append(statusCell);
    recentTable.append(row);
  }
}

async function fetchData() {
  try {
    const [summary, recent, byProvider, byModel, metrics] = await Promise.all([
      fetch("/api/summary").then((res) => res.json()),
      fetch("/api/recent?n=20").then((res) => res.json()),
      fetch("/api/summary/by-provider").then((res) => res.json()),
      fetch("/api/summary/by-model").then((res) => res.json()),
      fetch("/api/metrics?limit=60").then((res) => res.json())
    ]);

    updateCards(summary);
    renderRecentTable(recent.metrics || []);
    renderTokensChart(metrics.metrics || []);
    renderLatencyChart(byModel.models || []);
    renderProviderChart(byProvider.providers || []);
  } catch (error) {
    document.querySelector("#refresh-status").textContent =
      error instanceof Error ? error.message : String(error);
  }
}

chatTab.addEventListener("click", () => switchView("chat"));
dashboardTab.addEventListener("click", () => switchView("dashboard"));
providerSelect.addEventListener("change", () => updateModelSelector(providerSelect.value));
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});
promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

updateModelSelector(providerSelect.value);
ensureEmptyState();
fetchData();
setInterval(fetchData, 10000);
