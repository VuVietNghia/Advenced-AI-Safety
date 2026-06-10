import pytest
import asyncio
from evaluators.exact_match import ExactMatchEvaluator
from evaluators.contains import ContainsEvaluator
from evaluators.json_schema import JsonSchemaEvaluator

@pytest.mark.asyncio
async def test_exact_match_pass():
    ev = ExactMatchEvaluator()
    result = await ev.evaluate("  12  ", {"expected": "12"})
    assert result.passed is True
    assert result.score == 1.0

@pytest.mark.asyncio
async def test_exact_match_fail():
    ev = ExactMatchEvaluator()
    result = await ev.evaluate("13", {"expected": "12"})
    assert result.passed is False
    assert result.score == 0.0

@pytest.mark.asyncio
async def test_contains_partial():
    ev = ContainsEvaluator()
    result = await ev.evaluate("The answer is 120 units", {"expected_contains": ["120", "240"]})
    assert result.score == 0.5
    assert result.passed is False

@pytest.mark.asyncio
async def test_contains_full():
    ev = ContainsEvaluator()
    result = await ev.evaluate("120 and 240", {"expected_contains": ["120", "240"]})
    assert result.score == 1.0
    assert result.passed is True

@pytest.mark.asyncio
async def test_json_schema_pass():
    ev = JsonSchemaEvaluator()
    schema = {"type": "object", "properties": {"a": {"type": "number"}}, "required": ["a"]}
    result = await ev.evaluate('```json\n{"a": 1}\n```', {"schema": schema})
    assert result.passed is True

@pytest.mark.asyncio
async def test_json_schema_fail():
    ev = JsonSchemaEvaluator()
    schema = {"type": "object", "properties": {"a": {"type": "number"}}, "required": ["a"]}
    result = await ev.evaluate('{"b": 1}', {"schema": schema})
    assert result.passed is False
