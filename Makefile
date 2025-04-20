# Root Makefile for the TBB Project

# Variables
ENV_FILE ?= .env
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend
# IP restriction configuration
ALLOWED_IPS ?= 127.0.0.1,::1,localhost

# Targets
.PHONY: all setup run stop clean docker-build docker-up docker-down docker-logs dev-backend dev-frontend help

# Default target
all: setup

# Setup both backend and frontend
setup: setup-backend setup-frontend

# Setup backend
setup-backend:
	@echo "Setting up backend..."
	cd $(BACKEND_DIR) && $(MAKE) dev-setup

# Setup frontend
setup-frontend:
	@echo "Setting up frontend..."
	cd $(FRONTEND_DIR) && npm install

# Run both services in development mode
run: run-backend run-frontend

# Run backend in development mode
run-backend:
	@echo "Running backend in development mode..."
	cd $(BACKEND_DIR) && ALLOWED_IPS=$(ALLOWED_IPS) $(MAKE) run

# Run frontend in development mode
run-frontend:
	@echo "Running frontend in development mode..."
	cd $(FRONTEND_DIR) && npm start

# Stop running services
stop:
	@echo "Stopping running services..."
	-pkill -f "tbb-backend" || true
	-pkill -f "react-scripts" || true

# Clean both projects
clean: clean-backend clean-frontend

# Clean backend
clean-backend:
	@echo "Cleaning backend..."
	cd $(BACKEND_DIR) && $(MAKE) clean

# Clean frontend
clean-frontend:
	@echo "Cleaning frontend..."
	cd $(FRONTEND_DIR) && rm -rf node_modules build

# Docker commands

# Build all Docker images
docker-build:
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

# Start all services with Docker Compose
docker-up:
	@echo "Starting all services with Docker Compose..."
	@echo "Backend IP restriction: Only $(ALLOWED_IPS) allowed (plus Docker internal)"
	ALLOWED_IPS=$(ALLOWED_IPS) $(DOCKER_COMPOSE) --env-file $(ENV_FILE) up -d

# Stop all services with Docker Compose
docker-down:
	@echo "Stopping all services with Docker Compose..."
	$(DOCKER_COMPOSE) down

# View Docker logs for all services
docker-logs:
	@echo "Showing logs for all services..."
	$(DOCKER_COMPOSE) logs -f

# View Docker logs for backend service
docker-logs-backend:
	@echo "Showing logs for backend service..."
	$(DOCKER_COMPOSE) logs -f backend

# View Docker logs for frontend service
docker-logs-frontend:
	@echo "Showing logs for frontend service..."
	$(DOCKER_COMPOSE) logs -f frontend

# Development commands

# Start backend in development mode
dev-backend:
	@echo "Starting backend in development mode..."
	cd $(BACKEND_DIR) && ALLOWED_IPS=$(ALLOWED_IPS) $(MAKE) run

# Start frontend in development mode
dev-frontend:
	@echo "Starting frontend in development mode..."
	cd $(FRONTEND_DIR) && npm start

# Security commands

# Allow requests from all IPs
allow-all-ips:
	@echo "Allowing requests from all IPs..."
	sed -i 's/^ALLOWED_IPS=.*/ALLOWED_IPS=*/' $(ENV_FILE)
	@echo "Updated $(ENV_FILE) file to allow all IPs"

# Restrict to localhost only
restrict-to-localhost:
	@echo "Restricting to localhost only..."
	sed -i 's/^ALLOWED_IPS=.*/ALLOWED_IPS=127.0.0.1,::1,localhost/' $(ENV_FILE)
	@echo "Updated $(ENV_FILE) file to restrict to localhost only"

# Help target
help:
	@echo "TBB Project Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  all              - Set up both backend and frontend (default)"
	@echo "  setup            - Set up both backend and frontend"
	@echo "  setup-backend    - Set up backend"
	@echo "  setup-frontend   - Set up frontend"
	@echo "  run              - Run both services in development mode"
	@echo "  run-backend      - Run backend in development mode"
	@echo "  run-frontend     - Run frontend in development mode"
	@echo "  stop             - Stop running services"
	@echo "  clean            - Clean both projects"
	@echo "  clean-backend    - Clean backend"
	@echo "  clean-frontend   - Clean frontend"
	@echo "  docker-build     - Build all Docker images"
	@echo "  docker-up        - Start all services with Docker Compose"
	@echo "  docker-down      - Stop all services with Docker Compose"
	@echo "  docker-logs      - View Docker logs for all services"
	@echo "  docker-logs-backend - View Docker logs for backend service"
	@echo "  docker-logs-frontend - View Docker logs for frontend service"
	@echo "  dev-backend      - Start backend in development mode"
	@echo "  dev-frontend     - Start frontend in development mode"
	@echo "  allow-all-ips    - Configure to allow all IPs to access the backend"
	@echo "  restrict-to-localhost - Configure to restrict backend access to localhost only"
	@echo ""
	@echo "Variables:"
	@echo "  ENV_FILE         - Environment file path (default: .env)"
	@echo "  ALLOWED_IPS      - Comma-separated list of allowed IPs (default: localhost only)"

# Default target
.DEFAULT_GOAL := help 