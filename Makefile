# Makefile

# Install dependencies
install:
	npm install

# Run linters
lint:
	npm run lint

# Format code
format:
	npm run format

# Type checking
type-check:
	npm run type-check

# Run tests
test:
	npm test

# Pre-commit hook
pre-commit:
	./.hooks/pre-commit

# Pre-push hook
pre-push:
	./.hooks/pre-push

# Post-merge hook
post-merge:
	./.hooks/post-merge

# Security scan
security-scan:
	python3 scripts/security_scan.py

# Validate data example
validate-data:
	python3 scripts/validate_data.py <schema_module> <json_file>
