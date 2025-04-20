# Tbb Backend API

A simple Go backend service built with Gin framework to support the Tbb Space website. The API provides a health check endpoint and will later implement integration with Gemini for chat functionality.

## Features

- RESTful API built with Go and Gin
- Health check endpoint
- CORS support for frontend integration
- Structured for maintainability and future expansion
- Graceful shutdown

## Prerequisites

- Go 1.19 or higher
- Git

## Setup

1. Clone the repository
2. Install dependencies:

```bash
go mod tidy
```

## Running the API

To run the API server locally:

```bash
cd cmd/server
go run main.go
```

The server will start on port 8000 by default. You can customize the port by setting the `PORT` environment variable.

## API Endpoints

### Health Check

- **URL**: `/api/v1/health`
- **Method**: `GET`
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "status": "up",
      "timestamp": "2023-06-15T10:30:00Z",
      "service": "tbb-backend-api",
      "version": "0.1.0"
    }
    ```

### Chat (Placeholder)

- **URL**: `/api/v1/chat`
- **Method**: `POST`
- **Request Body**: 
  ```json
  {
    "message": "Hello, how are you?"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "response": "This is a placeholder response. Actual Gemini integration coming soon."
    }
    ```

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go       # Entry point of the application
├── internal/
│   └── routes/
│       └── routes.go     # API route definitions
├── go.mod
├── go.sum
└── README.md
```

## Future Enhancements

- Add Gemini API integration for chat functionality
- Add authentication
- Implement request validation
- Add structured logging
- Add unit and integration tests 