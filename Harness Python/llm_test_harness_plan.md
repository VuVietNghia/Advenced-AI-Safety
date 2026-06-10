# PLAN: LLM Test Harness — Multi-Provider Evaluation Framework

## Mục tiêu
Xây dựng một test harness cho LLM outputs, hỗ trợ:
- **Anthropic Claude** (native SDK)
- **LM Studio** (local, OpenAI-compatible tại `localhost:1234/v1`)
- **Third-party providers** (OpenRouter, Groq, Together AI...)
- Automated scoring (exact match, contains, JSON schema, LLM-as-judge)
- Regression testing với baseline comparison
- Report kết quả dạng bảng và JSON

---

## Yêu cầu môi trường
- Python 3.12 (khuyến nghị)
- Virtual environment `.venv`
- File `.env` chứa API keys

---

## Cấu trúc project

```
llm-test-harness/
├── .env                        # API keys (không commit)
├── .env.example
├── requirements.txt
├── pytest.ini
│
├── providers/
│   ├── __init__.py
│   ├── base.py                 # Abstract base class
│   ├── anthropic_provider.py   # Anthropic native SDK
│   └── openai_compat.py        # LM Studio + mọi OpenAI-compat provider
│
├── evaluators/
│   ├── __init__.py
│   ├── base.py                 # Abstract evaluator
│   ├── exact_match.py          # So sánh string chính xác
│   ├── contains.py             # Kiểm tra output chứa keywords
│   ├── json_schema.py          # Validate JSON structure
│   └── llm_judge.py            # Dùng Claude làm judge
│
├── harness/
│   ├── __init__.py
│   ├── runner.py               # Chạy test cases async
│   ├── reporter.py             # In bảng kết quả + xuất JSON
│   └── baseline.py             # Load/save baseline scores
│
├── datasets/
│   ├── math_basic.jsonl
│   ├── code_generation.jsonl
│   └── json_output.jsonl
│
├── baselines/
│   └── .gitkeep                # Chứa baseline JSON files
│
├── tests/
│   ├── test_providers.py       # Pytest: kiểm tra providers kết nối được
│   ├── test_evaluators.py      # Pytest: unit test từng evaluator
│   └── test_regression.py      # Pytest: so sánh với baseline
│
└── main.py                     # Entry point: chạy harness từ CLI
```

---

## BƯỚC 1 — Setup môi trường

### 1.1 Tạo virtual environment
```bash
python3.12 -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate
```

### 1.2 requirements.txt
```
anthropic>=0.40.0
openai>=1.50.0
pytest>=8.0.0
pytest-asyncio>=0.23.0
jsonschema>=4.23.0
python-dotenv>=1.0.0
tabulate>=0.9.0
aiohttp>=3.10.0
```

### 1.3 .env.example
```
ANTHROPIC_AUTH_TOKEN=user-1779871750268-key
ANTHROPIC_BASE_URL=https://llm-hub.roxane.one
ANTHROPIC_DEFAULT_HAIKU_MODEL=glm-4.5
ANTHROPIC_DEFAULT_SONNET_MODEL=glm-4.6
ANTHROPIC_DEFAULT_OPUS_MODEL=glm-4.7
OPENROUTER_API_KEY=sk-or-...
GROQ_API_KEY=gsk_...
LM_STUDIO_BASE_URL=http://localhost:1234/v1
LM_STUDIO_MODEL=qwen2.5-7b-instruct
```

---

## BƯỚC 2 — Providers

### 2.1 `providers/base.py`
```python
from abc import ABC, abstractmethod

class BaseProvider(ABC):
    name: str = "base"

    @abstractmethod
    async def complete(self, messages: list[dict], **kwargs) -> str:
        """Gửi messages, trả về string response."""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Kiểm tra provider có hoạt động không."""
        pass
```

### 2.2 `providers/anthropic_provider.py`
- Import `anthropic.AsyncAnthropic`
- `__init__`: nhận `api_key` (auth token), `base_url`, `model` (default dùng biến môi trường `ANTHROPIC_DEFAULT_HAIKU_MODEL`)
- Khởi tạo client: `self.client = AsyncAnthropic(api_key=api_key, base_url=base_url)`
- `complete()`: gọi `messages.create`, trả về `resp.content[0].text`
- `health_check()`: gọi complete với message ngắn, catch exception → return bool

### 2.3 `providers/openai_compat.py`
- Import `openai.AsyncOpenAI`
- `__init__`: nhận `base_url`, `api_key`, `model`, `provider_name`
- `complete()`: gọi `chat.completions.create`, trả về `resp.choices[0].message.content`
- `health_check()`: tương tự anthropic

### 2.4 `providers/__init__.py`
```python
from dotenv import load_dotenv
import os
load_dotenv()

from providers.anthropic_provider import AnthropicProvider
from providers.openai_compat import OpenAICompatProvider

REGISTRY: dict = {
    "claude": AnthropicProvider(
        api_key=os.getenv("ANTHROPIC_AUTH_TOKEN", "user-1779871750268-key"),
        base_url=os.getenv("ANTHROPIC_BASE_URL", "https://llm-hub.roxane.one"),
        model=os.getenv("ANTHROPIC_DEFAULT_HAIKU_MODEL", "glm-4.5"),
    ),
    "claude_judge": AnthropicProvider(
        api_key=os.getenv("ANTHROPIC_AUTH_TOKEN", "user-1779871750268-key"),
        base_url=os.getenv("ANTHROPIC_BASE_URL", "https://llm-hub.roxane.one"),
        model=os.getenv("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-4.6"),
    ),
    "lm_studio": OpenAICompatProvider(
        base_url=os.getenv("LM_STUDIO_BASE_URL", "http://localhost:1234/v1"),
        api_key="lm-studio",
        model=os.getenv("LM_STUDIO_MODEL", "local-model"),
        provider_name="lm_studio",
    ),
    "openrouter": OpenAICompatProvider(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY", ""),
        model="mistralai/mistral-7b-instruct",
        provider_name="openrouter",
    ),
    "groq": OpenAICompatProvider(
        base_url="https://api.groq.com/openai/v1",
        api_key=os.getenv("GROQ_API_KEY", ""),
        model="llama-3.1-8b-instant",
        provider_name="groq",
    ),
}
```

---

## BƯỚC 3 — Evaluators

### 3.1 `evaluators/base.py`
```python
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class EvalResult:
    passed: bool
    score: float          # 0.0 → 1.0
    reason: str = ""

class BaseEvaluator(ABC):
    @abstractmethod
    def evaluate(self, output: str, test_case: dict) -> EvalResult:
        pass
```

### 3.2 `evaluators/exact_match.py`
- So sánh `output.strip().lower()` với `test_case["expected"].strip().lower()`
- `score = 1.0` nếu match, `0.0` nếu không

### 3.3 `evaluators/contains.py`
- Đọc `test_case["expected_contains"]` (list of strings)
- Score = số keywords có mặt / tổng số keywords
- `passed = score == 1.0`

### 3.4 `evaluators/json_schema.py`
- Parse output thành JSON (strip markdown fences ` ```json ``` ` trước)
- Validate với `jsonschema.validate(instance, test_case["schema"])`
- `passed = True` nếu không raise exception

### 3.5 `evaluators/llm_judge.py`
- Import `REGISTRY` từ providers, dùng `REGISTRY["claude_judge"]` làm mô hình đánh giá (model mạnh hơn như `glm-4.6`).
- Xây dựng judge prompt:
  ```
  You are an expert evaluator. Given a question and an answer, rate the answer.
  Question: {question}
  Answer: {output}
  Criteria: {criteria}
  
  Respond ONLY with JSON: {"score": <1-5>, "reason": "<short reason>"}
  ```
- Gọi Claude, parse JSON response
- Normalize score về 0.0–1.0 (`score / 5`)
- `passed = normalized_score >= threshold` (default 0.6)

### 3.6 `evaluators/__init__.py`
```python
EVALUATOR_MAP = {
    "exact_match": ExactMatchEvaluator,
    "contains": ContainsEvaluator,
    "json_schema": JsonSchemaEvaluator,
    "llm_judge": LLMJudgeEvaluator,
}

def get_evaluator(eval_type: str) -> BaseEvaluator:
    return EVALUATOR_MAP[eval_type]()
```

---

## BƯỚC 4 — Test Dataset Format

### JSONL schema: mỗi dòng là 1 test case
```jsonl
{"id": "math_001", "input": "What is 15 * 8?", "eval_type": "contains", "expected_contains": ["120"], "tags": ["math"]}
{"id": "math_002", "input": "What is the square root of 144?", "eval_type": "exact_match", "expected": "12", "tags": ["math"]}
{"id": "code_001", "input": "Write a Python function to reverse a string", "eval_type": "llm_judge", "criteria": "Correct Python syntax, handles edge cases, clean code", "tags": ["code"]}
{"id": "json_001", "input": "Return JSON with fields: name (string), age (number), active (boolean)", "eval_type": "json_schema", "schema": {"type": "object", "required": ["name", "age", "active"], "properties": {"name": {"type": "string"}, "age": {"type": "number"}, "active": {"type": "boolean"}}}, "tags": ["structured_output"]}
```

### Tạo các file dataset mẫu:
- `datasets/math_basic.jsonl` — 5 test cases: arithmetic, basic algebra
- `datasets/code_generation.jsonl` — 5 test cases: Python snippets, dùng `llm_judge`
- `datasets/json_output.jsonl` — 5 test cases: JSON schema validation

---

## BƯỚC 5 — Harness Runner

### 5.1 `harness/runner.py`
```python
import asyncio, time
from dataclasses import dataclass
from providers import REGISTRY
from evaluators import get_evaluator

@dataclass
class TestResult:
    test_id: str
    provider: str
    input: str
    output: str
    passed: bool
    score: float
    reason: str
    latency_ms: float
    error: str = ""

async def run_single(provider_name: str, test_case: dict) -> TestResult:
    provider = REGISTRY[provider_name]
    start = time.monotonic()
    try:
        output = await provider.complete([{"role": "user", "content": test_case["input"]}])
        latency = (time.monotonic() - start) * 1000
        evaluator = get_evaluator(test_case["eval_type"])
        result = evaluator.evaluate(output, test_case)
        return TestResult(
            test_id=test_case["id"],
            provider=provider_name,
            input=test_case["input"],
            output=output,
            passed=result.passed,
            score=result.score,
            reason=result.reason,
            latency_ms=round(latency, 1),
        )
    except Exception as e:
        latency = (time.monotonic() - start) * 1000
        return TestResult(
            test_id=test_case["id"],
            provider=provider_name,
            input=test_case["input"],
            output="",
            passed=False,
            score=0.0,
            reason="",
            latency_ms=round(latency, 1),
            error=str(e),
        )

async def run_suite(
    test_cases: list[dict],
    providers: list[str],
    concurrency: int = 5
) -> list[TestResult]:
    semaphore = asyncio.Semaphore(concurrency)

    async def bounded(p, tc):
        async with semaphore:
            return await run_single(p, tc)

    tasks = [bounded(p, tc) for p in providers for tc in test_cases]
    return await asyncio.gather(*tasks)
```

### 5.2 `harness/reporter.py`
- Nhận `list[TestResult]`
- In bảng dùng `tabulate`:
  ```
  Provider    | Test ID   | Pass | Score | Latency | Reason
  ------------|-----------|------|-------|---------|-------
  claude      | math_001  | ✅   | 1.00  | 812ms   |
  lm_studio   | math_001  | ✅   | 1.00  | 1240ms  |
  groq        | math_001  | ❌   | 0.00  | 340ms   | missing keyword
  ```
- In summary per provider: `pass_rate`, `avg_score`, `avg_latency`
- Export kết quả ra `results/run_{timestamp}.json`

### 5.3 `harness/baseline.py`
```python
import json, os
from pathlib import Path

BASELINE_DIR = Path("baselines")

def save_baseline(results: list[dict], name: str):
    BASELINE_DIR.mkdir(exist_ok=True)
    path = BASELINE_DIR / f"{name}.json"
    with open(path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"Baseline saved: {path}")

def load_baseline(name: str) -> list[dict] | None:
    path = BASELINE_DIR / f"{name}.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)

def compare_with_baseline(current: list[dict], baseline: list[dict]) -> dict:
    """
    Trả về dict: {
      "regressions": [...],   # test cases pass baseline nhưng fail hiện tại
      "improvements": [...],  # test cases fail baseline nhưng pass hiện tại
      "score_delta": float    # avg_score_current - avg_score_baseline
    }
    """
    # implement comparison logic
```

---

## BƯỚC 6 — Pytest Integration

### 6.1 `pytest.ini`
```ini
[pytest]
asyncio_mode = auto
testpaths = tests
```

### 6.2 `tests/test_providers.py`
- Test `health_check()` cho từng provider trong REGISTRY
- Skip nếu API key chưa set hoặc LM Studio không chạy

```python
import pytest
from providers import REGISTRY

@pytest.mark.asyncio
@pytest.mark.parametrize("name", ["claude", "lm_studio", "groq"])
async def test_provider_health(name):
    provider = REGISTRY[name]
    result = await provider.health_check()
    assert result is True, f"{name} health check failed"
```

### 6.3 `tests/test_evaluators.py`
Unit test từng evaluator không cần gọi API:
```python
from evaluators.exact_match import ExactMatchEvaluator
from evaluators.contains import ContainsEvaluator

def test_exact_match_pass():
    ev = ExactMatchEvaluator()
    result = ev.evaluate("  12  ", {"expected": "12"})
    assert result.passed is True
    assert result.score == 1.0

def test_contains_partial():
    ev = ContainsEvaluator()
    result = ev.evaluate("The answer is 120 units", {"expected_contains": ["120", "240"]})
    assert result.score == 0.5
    assert result.passed is False
```

### 6.4 `tests/test_regression.py`
```python
import pytest, asyncio, json
from harness.runner import run_suite
from harness.baseline import load_baseline, compare_with_baseline

REGRESSION_THRESHOLD = 0.05  # avg_score không được giảm quá 5%

@pytest.mark.asyncio
async def test_no_regression_claude():
    # Load test cases
    with open("datasets/math_basic.jsonl") as f:
        cases = [json.loads(l) for l in f]

    results = await run_suite(cases, providers=["claude"])
    baseline = load_baseline("claude_math")

    if baseline is None:
        pytest.skip("No baseline found — run main.py --save-baseline first")

    comparison = compare_with_baseline(
        [r.__dict__ for r in results], baseline
    )
    assert comparison["score_delta"] >= -REGRESSION_THRESHOLD, (
        f"Regression detected! Score dropped by {-comparison['score_delta']:.2%}"
    )
```

---

## BƯỚC 7 — Entry Point

### `main.py`
```
Usage:
  python main.py run --providers claude lm_studio --dataset math_basic
  python main.py run --providers all --dataset all
  python main.py run --save-baseline --name claude_math
  python main.py compare --baseline claude_math
  python main.py health
```

Logic:
1. Parse CLI args với `argparse`
2. Load dataset files từ `datasets/` theo tên
3. Gọi `run_suite()`
4. Gọi `reporter.print_table()` và `reporter.export_json()`
5. Nếu `--save-baseline`: gọi `save_baseline()`
6. Nếu `--compare`: gọi `compare_with_baseline()` và in diff

---

## BƯỚC 8 — Verification Checklist

Agent tự kiểm tra sau khi code xong:

- [ ] `pip install -r requirements.txt` không lỗi
- [ ] `python main.py health` — in trạng thái từng provider
- [ ] `pytest tests/test_evaluators.py -v` — tất cả pass (không cần API)
- [ ] `python main.py run --providers claude --dataset math_basic` — chạy được, in bảng kết quả
- [ ] `python main.py run --providers lm_studio --dataset math_basic` — chạy được nếu LM Studio đang mở
- [ ] `python main.py run --save-baseline --name claude_math` — tạo file trong `baselines/`
- [ ] `pytest tests/test_regression.py -v` — pass sau khi đã có baseline
- [ ] File `results/` xuất hiện sau mỗi lần run với timestamp

---

## Lưu ý cho Agent

1. **Python version**: Dùng Python 3.12, tạo venv `.venv` trước khi cài packages
2. **Async**: Tất cả provider calls là `async` — dùng `asyncio.run()` trong `main.py`
3. **LM Studio**: `api_key` có thể là bất kỳ string nào, nhưng phải truyền vào (không được để trống hoàn toàn)
4. **LLM Judge**: Chỉ gọi khi `eval_type == "llm_judge"` — tốn API cost
5. **Error handling**: Provider lỗi → `TestResult` với `error` field, không crash toàn bộ run
6. **Concurrency**: Default `semaphore=5` để tránh rate limit
7. **Không dùng `@xenova/transformers`** — không liên quan project này nhưng tránh nhầm
