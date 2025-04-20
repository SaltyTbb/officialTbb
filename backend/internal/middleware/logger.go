package middleware

import (
	"bytes"
	"io"
	"time"

	"github.com/SaltyTbb/backend/internal/logger"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

const (
	// RequestIDKey is the key used to identify the request ID in the context
	RequestIDKey = "requestID"
	// StartTimeKey is the key used to store the request start time
	StartTimeKey = "startTime"
	// MaxBodyLogSize is the maximum size of the body to log
	MaxBodyLogSize = 1024 // 1KB
)

// bodyLogWriter is a simple response writer wrapper to capture the body
type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

// InitLogger initializes the zerolog logger - deprecated, use logger.Init() instead
func InitLogger() {
	// This function is kept for backward compatibility but should not be used
	// Use logger.Init() from the logger package instead
	logger.Init()
}

// logRequestStart logs information about the incoming request
func before(c *gin.Context, requestID string, body string) {
	log.Info().
		Str("requestID", requestID).
		Str("method", c.Request.Method).
		Str("path", c.Request.URL.Path).
		Str("clientIP", c.ClientIP()).
		Str("requestBody", body).
		Msg("Incoming request")
}

// logRequestEnd logs information about the outgoing response
func after(c *gin.Context, requestID string, duration time.Duration, body string) {
	log.Info().
		Str("requestID", requestID).
		Int("status", c.Writer.Status()).
		Dur("duration_ms", duration).
		Str("clientIP", c.ClientIP()).
		Str("responseBody", body).
		Msg("Outgoing response")
}

// Logger is a middleware that logs incoming requests and outgoing responses
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := uuid.New().String()
		c.Set(RequestIDKey, requestID)
		startTime := time.Now()

		// Capture request body
		var requestBody string
		if c.Request.Body != nil {
			bodyBytes, _ := io.ReadAll(c.Request.Body)
			if len(bodyBytes) > 0 {
				if len(bodyBytes) > MaxBodyLogSize {
					bodyBytes = bodyBytes[:MaxBodyLogSize]
				}
				requestBody = string(bodyBytes)
				// Restore the body for further processing
				c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
			}
		}

		// Log request
		before(c, requestID, requestBody)

		// Create a body writer for response
		bodyWriter := &bodyLogWriter{
			ResponseWriter: c.Writer,
			body:           &bytes.Buffer{},
		}
		c.Writer = bodyWriter

		// Process request
		c.Next()

		// Log response
		duration := time.Since(startTime)
		responseBody := bodyWriter.body.String()
		if len(responseBody) > MaxBodyLogSize {
			responseBody = responseBody[:MaxBodyLogSize]
		}

		after(c, requestID, duration, responseBody)
	}
}

// GetRequestID retrieves the request ID from the context
func GetRequestID(c *gin.Context) string {
	requestID, exists := c.Get(RequestIDKey)
	if !exists {
		return "unknown"
	}
	return requestID.(string)
}
