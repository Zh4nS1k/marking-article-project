"""validate_data.py

Utility script to validate JSON data against a Pydantic model.

Usage:
    python3 scripts/validate_data.py <schema_module> <json_file>

Arguments:
    schema_module: Python module path (e.g., myapp.schemas.UserSchema)
    json_file: Path to JSON file to validate.

Exit code 0 on success, non-zero on validation errors.
"""

import sys
import json
import importlib
from pydantic import ValidationError


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 validate_data.py <schema_module> <json_file>")
        sys.exit(1)
    schema_path, json_path = sys.argv[1], sys.argv[2]
    try:
        module_path, class_name = schema_path.rsplit(".", 1)
        module = importlib.import_module(module_path)
        schema_cls = getattr(module, class_name)
    except Exception as e:
        print(f"Failed to load schema: {e}")
        sys.exit(2)
    try:
        with open(json_path) as f:
            data = json.load(f)
    except Exception as e:
        print(f"Failed to read JSON file: {e}")
        sys.exit(3)
    try:
        schema_cls(**data)
        print("Validation succeeded.")
        sys.exit(0)
    except ValidationError as ve:
        print("Validation errors:")
        print(ve)
        sys.exit(4)


if __name__ == "__main__":
    main()
