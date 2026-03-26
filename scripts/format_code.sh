#!/usr/bin/env bash
# format_code.sh
# Runs Prettier for JS/TS and Black for Python code.

set -e

# Prettier for JS/TS
if command -v npx >/dev/null 2>&1; then
  echo "[Format] Running Prettier..."
  npx --yes prettier --write "**/*.{js,ts,tsx,jsx}" || true
fi

# Black for Python
if command -v black >/dev/null 2>&1; then
  echo "[Format] Running Black..."
  black . || true
fi

echo "[Format] Formatting completed."
