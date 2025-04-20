package logger

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/rs/zerolog"
)

var (
	logWriter      io.Writer
	logFilePath    string
	logInitialized bool
	logMutex       sync.Mutex
)

// GetLogWriter returns a configured writer for logging that writes to both stdout and a log file
func GetLogWriter() io.Writer {
	logMutex.Lock()
	defer logMutex.Unlock()

	if logInitialized {
		return logWriter
	}

	// Create logs directory if it doesn't exist
	logDir := os.Getenv("LOG_DIR")
	if logDir == "" {
		logDir = DefaultLogDir
	}

	if err := os.MkdirAll(logDir, 0755); err != nil {
		fmt.Printf("Error creating log directory: %v\n", err)
		// Continue with console logging if file logging setup fails
		logWriter = os.Stdout
		logInitialized = true
		return logWriter
	}

	// Create a log file with current date in the name
	logFilePath = filepath.Join(logDir, fmt.Sprintf("tbb-api-%s.log", time.Now().Format("2006-01-02")))
	logFile, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)

	// If log file was created successfully, use a multi-writer
	if err == nil {
		logWriter = zerolog.MultiLevelWriter(os.Stdout, logFile)
		// We'll log this info when the logger is actually initialized
	} else {
		fmt.Printf("Error opening log file: %v, using console logging only\n", err)
		logWriter = os.Stdout
	}

	logInitialized = true
	return logWriter
}

// GetLogFilePath returns the path to the current log file, or empty string if file logging is not enabled
func GetLogFilePath() string {
	logMutex.Lock()
	defer logMutex.Unlock()
	return logFilePath
}
