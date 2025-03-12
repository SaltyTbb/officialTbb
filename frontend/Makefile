.PHONY: install clean build dev test lint

# Default target
all: install build

# Install dependencies
install:
	npm install

# Clean the project
clean:
	rm -rf node_modules
	rm -rf build
	rm -f package-lock.json

# Build the project
build:
	npm run build

# Run development server
dev:
	npm run start

# Run tests
test:
	npm run test

# Run linter
lint:
	npm run lint

# Clean and reinstall everything
reinstall: clean install

# Build for production
prod: install build 