import os
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

def load_settings():
    # Thư mục chứa config.py là Harness/, settings.json nằm ở parent (week3_advanced_ai_satefy)
    settings_path = Path(__file__).parent.parent / "settings.json"
    if settings_path.exists():
        try:
            with open(settings_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("env", {})
        except Exception as e:
            print(f"Warning: Failed to load settings.json: {e}")
    return {}

_settings_env = load_settings()

def get_env(key: str, default: str = "") -> str:
    if key in _settings_env:
        return _settings_env[key]
    return os.getenv(key, default)
