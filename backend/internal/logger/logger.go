package logger

import (
	"context"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const (
	// TraceIDKey is the key used to identify the trace ID in the context
	TraceIDKey = "traceID"
	// DefaultLogDir is the default directory for log files
	DefaultLogDir = "logs"
)

// Init initializes the zerolog logger
func Init() {
	// Configure zerolog
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	// Get the shared log writer that writes to both console and file
	writer := GetLogWriter()

	log.Logger = zerolog.New(writer).
		With().
		Timestamp().
		Logger()

	// Log the file path if file logging is enabled
	if logPath := GetLogFilePath(); logPath != "" {
		log.Info().Str("logFile", logPath).Msg("File logging enabled")
	}
}

// WithTraceID adds a trace ID to the logger from the context
func WithTraceID(ctx context.Context) *zerolog.Logger {
	traceID := getTraceIDFromContext(ctx)
	logger := log.With().Str("traceID", traceID).Logger()
	return &logger
}

// WithCtx creates a logger with context information
func WithCtx(ctx context.Context) *zerolog.Logger {
	// Start with trace ID
	logger := WithTraceID(ctx)

	// Add additional context info if it's a Gin context
	if ginCtx, ok := ctx.(*gin.Context); ok {
		enriched := logger.With().
			Str("method", ginCtx.Request.Method).
			Str("path", ginCtx.Request.URL.Path).
			Str("clientIP", ginCtx.ClientIP()).
			Logger()
		return &enriched
	}

	return logger
}

// getTraceIDFromContext extracts trace ID from context
func getTraceIDFromContext(ctx context.Context) string {
	// Try to get the trace ID from the context
	if ctx != nil {
		// If it's a Gin context
		if ginCtx, ok := ctx.(*gin.Context); ok {
			if id, exists := ginCtx.Get(TraceIDKey); exists {
				return id.(string)
			}
		}

		// Check for value in regular context
		if id, ok := ctx.Value(TraceIDKey).(string); ok {
			return id
		}
	}

	// Generate a new trace ID if none exists
	return uuid.New().String()
}

// NewTraceIDMiddleware creates a middleware that adds a trace ID to the context
func NewTraceIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if trace ID is in headers (for distributed tracing)
		traceID := c.GetHeader("X-Trace-ID")
		if traceID == "" {
			traceID = uuid.New().String()
		}

		// Store trace ID in Gin context
		c.Set(TraceIDKey, traceID)

		// Add trace ID to response headers
		c.Header("X-Trace-ID", traceID)

		c.Next()
	}
}

// ContextWithTraceID creates a new context with a trace ID
func ContextWithTraceID(ctx context.Context) context.Context {
	traceID := getTraceIDFromContext(ctx)
	return context.WithValue(ctx, TraceIDKey, traceID)
}

// Debug returns a debug logger with context
func Debug(ctx context.Context) *zerolog.Event {
	return WithCtx(ctx).Debug()
}

// Info returns an info logger with context
func Info(ctx context.Context) *zerolog.Event {
	return WithCtx(ctx).Info()
}

// Warn returns a warn logger with context
func Warn(ctx context.Context) *zerolog.Event {
	return WithCtx(ctx).Warn()
}

// Error returns an error logger with context
func Error(ctx context.Context) *zerolog.Event {
	return WithCtx(ctx).Error()
}

// Fatal returns a fatal logger with context
func Fatal(ctx context.Context) *zerolog.Event {
	return WithCtx(ctx).Fatal()
}
