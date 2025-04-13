package middleware

import (
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const (
	// RequestIDKey is the key used to identify the request ID in the context
	RequestIDKey = "requestID"
	// StartTimeKey is the key used to store the request start time
	StartTimeKey = "startTime"
)

// InitLogger initializes the zerolog logger
func InitLogger() {
	// Configure zerolog
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = zerolog.New(os.Stdout).
		With().
		Timestamp().
		Logger()
}

// logRequestStart logs information about the incoming request
func before(c *gin.Context, requestID string) {
	log.Info().
		Str("requestID", requestID).
		Str("method", c.Request.Method).
		Str("path", c.Request.URL.Path).
		Str("clientIP", c.ClientIP()).
		Str("userAgent", c.Request.UserAgent()).
		Msg("Incoming request")
}

// logRequestEnd logs information about the outgoing response
func after(c *gin.Context, requestID string, duration time.Duration) {
	log.Info().
		Str("requestID", requestID).
		Int("status", c.Writer.Status()).
		Dur("duration", duration).
		Int("responseSize", c.Writer.Size()).
		Str("method", c.Request.Method).
		Str("path", c.Request.URL.Path).
		Str("clientIP", c.ClientIP()).
		Msg("Outgoing response")
}

// Logger is a middleware that logs incoming requests and outgoing responses
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := uuid.New().String()
		c.Set(RequestIDKey, requestID)
		startTime := time.Now()

		before(c, requestID)

		c.Next()

		duration := time.Since(startTime)

		after(c, requestID, duration)
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
