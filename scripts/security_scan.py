"""security_scan.py

Simple security scanning script placeholder. Scans for known vulnerable patterns in code.

Usage:
    python3 scripts/security_scan.py [path]

If no path is provided, scans the current directory.
"""
import sys
import os
import re

def scan_file(filepath):
    try:
        with open(filepath, 'r', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Failed to read {filepath}: {e}")
        return False
    # Example: look for hardcoded passwords
    patterns = [r"password\s*=\s*['\"]?\w+['\"]?", r"secret\s*=\s*['\"]?\w+['\"]?"]
    for pat in patterns:
        if re.search(pat, content, re.IGNORECASE):
            print(f"Potential secret found in {filepath}")
            return True
    return False

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else '.'
    found = False
    for root, _, files in os.walk(target):
        for name in files:
            if name.endswith(('.js', '.ts', '.tsx', '.py', '.json')):
                path = os.path.join(root, name)
                if scan_file(path):
                    found = True
    if found:
        sys.exit(1)
    else:
        print("No issues found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
