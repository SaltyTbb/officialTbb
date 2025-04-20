# Backend Makefile with Docker support

# Variables
APP_NAME = tbb-backend
VERSION ?= $(shell git describe --tags --always --dirty)
ENV_FILE ?= .env
DOCKER_IMAGE = $(APP_NAME):$(VERSION)
DOCKER_LATEST = $(APP_NAME):latest
GO_FILES = $(shell find . -name "*.go" -type f -not -path "./vendor/*")
PORT ?= 8000
# Default to localhost only for security
ALLOWED_IPS ?= 127.0.0.1,::1,localhost

# Go commands
GO = go
GORUN = $(GO) run
GOBUILD = $(GO) build
GOTEST = $(GO) test
GOVET = $(GO) vet
GOFMT = $(GO) fmt
GOMOD = $(GO) mod
GOCLEAN = $(GO) clean

# Docker commands
DOCKER = docker
DOCKER_COMPOSE = docker-compose

# Targets
.PHONY: all build clean run test fmt vet lint docker-build docker-run docker-stop docker-clean docker-logs docker-compose-up docker-compose-down help

all: clean fmt vet test build

# Build the application
build:
	@echo "Building $(APP_NAME)..."
	$(GOBUILD) -o bin/$(APP_NAME) ./cmd/server/main.go

# Clean the build artifacts
clean:
	@echo "Cleaning..."
	$(GOCLEAN)
	rm -f bin/$(APP_NAME)
	rm -rf ./logs/*.log

# Run the application
run:
	@echo "Running $(APP_NAME)..."
	@echo "IP restriction: Only $(ALLOWED_IPS) allowed"
	ALLOWED_IPS=$(ALLOWED_IPS) $(GORUN) ./cmd/server/main.go

# Run tests
test:
	@echo "Running tests..."
	$(GOTEST) -v ./...

# Format code
fmt:
	@echo "Formatting code..."
	$(GOFMT) ./...

# Vet code
vet:
	@echo "Vetting code..."
	$(GOVET) ./...

# Lint code (requires golangci-lint to be installed)
lint:
	@echo "Linting code..."
	@which golangci-lint > /dev/null || (echo "golangci-lint is not installed. Please install it first." && exit 1)
	golangci-lint run ./...

# Update dependencies
deps:
	@echo "Updating dependencies..."
	$(GOMOD) tidy
	$(GOMOD) verify

# Docker commands

# Build Docker image
docker-build:
	@echo "Building Docker image $(DOCKER_IMAGE)..."
	$(DOCKER) build -t $(DOCKER_IMAGE) -t $(DOCKER_LATEST) .

# Run Docker container
docker-run:
	@echo "Running Docker container $(APP_NAME)..."
	@echo "IP restriction: Only $(ALLOWED_IPS) allowed"
	$(DOCKER) run -d --name $(APP_NAME) -p $(PORT):8000 --env-file $(ENV_FILE) -e ALLOWED_IPS=$(ALLOWED_IPS) $(DOCKER_LATEST)

# Stop Docker container
docker-stop:
	@echo "Stopping Docker container $(APP_NAME)..."
	$(DOCKER) stop $(APP_NAME) || true
	$(DOCKER) rm $(APP_NAME) || true

# Clean Docker resources
docker-clean: docker-stop
	@echo "Cleaning Docker images..."
	$(DOCKER) rmi $(DOCKER_IMAGE) $(DOCKER_LATEST) || true

# View Docker logs
docker-logs:
	@echo "Showing logs for container $(APP_NAME)..."
	$(DOCKER) logs -f $(APP_NAME)

# Docker Compose commands

# Create docker-compose.yml if it doesn't exist
docker-compose.yml:
	@echo "Creating docker-compose.yml..."
	@echo "version: '3.8'" > docker-compose.yml
	@echo "" >> docker-compose.yml
	@echo "services:" >> docker-compose.yml
	@echo "  backend:" >> docker-compose.yml
	@echo "    build: ." >> docker-compose.yml
	@echo "    container_name: $(APP_NAME)" >> docker-compose.yml
	@echo "    ports:" >> docker-compose.yml
	@echo "      - \"$(PORT):8000\"" >> docker-compose.yml
	@echo "    env_file:" >> docker-compose.yml
	@echo "      - $(ENV_FILE)" >> docker-compose.yml
	@echo "    environment:" >> docker-compose.yml
	@echo "      - ALLOWED_IPS=$(ALLOWED_IPS)" >> docker-compose.yml
	@echo "      - ALLOW_DOCKER_INTERNAL=true" >> docker-compose.yml
	@echo "    volumes:" >> docker-compose.yml
	@echo "      - ./logs:/app/logs" >> docker-compose.yml
	@echo "    restart: unless-stopped" >> docker-compose.yml

# Start services with Docker Compose
docker-compose-up: docker-compose.yml
	@echo "Starting services with Docker Compose..."
	@echo "IP restriction: Only $(ALLOWED_IPS) allowed"
	$(DOCKER_COMPOSE) up -d

# Stop services with Docker Compose
docker-compose-down:
	@echo "Stopping services with Docker Compose..."
	$(DOCKER_COMPOSE) down

# Development environment setup
dev-setup:
	@echo "Setting up development environment..."
	$(GOMOD) download
	$(GOMOD) verify
	@echo "Creating logs directory if it doesn't exist..."
	mkdir -p logs

# Help target
help:
	@echo "Available targets:"
	@echo "  all              - Clean, format, vet, test, and build the application"
	@echo "  build            - Build the application"
	@echo "  clean            - Clean build artifacts"
	@echo "  run              - Run the application locally"
	@echo "  test             - Run tests"
	@echo "  fmt              - Format code"
	@echo "  vet              - Vet code"
	@echo "  lint             - Lint code (requires golangci-lint)"
	@echo "  deps             - Update dependencies"
	@echo "  docker-build     - Build Docker image"
	@echo "  docker-run       - Run Docker container"
	@echo "  docker-stop      - Stop and remove Docker container"
	@echo "  docker-clean     - Clean Docker resources"
	@echo "  docker-logs      - View Docker container logs"
	@echo "  docker-compose-up   - Start services with Docker Compose"
	@echo "  docker-compose-down - Stop services with Docker Compose"
	@echo "  dev-setup        - Set up development environment"
	@echo ""
	@echo "Variables:"
	@echo "  VERSION          - Version tag for Docker image (default: git tag/hash)"
	@echo "  ENV_FILE         - Environment file path (default: .env)"
	@echo "  PORT             - Port to expose (default: 8000)"
	@echo "  ALLOWED_IPS      - Comma-separated list of allowed IPs (default: localhost only)"

# Default target
.DEFAULT_GOAL := help 