FROM golang:1.23-alpine AS builder

# Install git and other necessary build tools
RUN apk add --no-cache git ca-certificates tzdata gcc musl-dev

# Set working directory
WORKDIR /src

# Copy all files
COPY . .

# Print directories for debugging
RUN echo "==== Directory Structure ====" && \
    ls -la . && \
    echo "==== Command Directory ====" && \
    ls -la ./cmd && \
    echo "==== Server Directory ====" && \
    ls -la ./cmd/server

# Download dependencies
RUN go mod download

# Go to server directory and build
RUN cd cmd/server && \
    go build -o /app/main

# Start fresh with a clean image
FROM alpine:latest

# Add necessary runtime packages
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the binary
COPY --from=builder /app/main .

# Copy required static files
COPY internal/static/ /app/internal/static/

# Copy .env file
COPY .env .

# Create logs directory
RUN mkdir -p /app/logs && chmod -R 755 /app/logs

# Set environment variables
ENV GIN_MODE=release
ENV PORT=8000

# Expose port 8000
EXPOSE 8000

# Run the application
CMD ["./main"] 