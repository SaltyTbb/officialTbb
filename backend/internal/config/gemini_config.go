package config

import (
	"log"
	"os"
	"strconv"
	"sync"

	"github.com/joho/godotenv"
)

type GeminiConfig struct {
	APIKey      string `json:"api_key"`
	Model       string `json:"model"`
	ClientLimit int    `json:"client_limit"`
	IdleTimeout int    `json:"idle_timeout"`
	Background  string `json:"background_file_path"`
}

var once sync.Once
var instance *GeminiConfig

func NewGeminiConfig() *GeminiConfig {
	once.Do(func() {
		// Load .env file
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Warning: Error loading .env file:", err)
		}

		// Get values from environment variables
		apiKey := os.Getenv("GEMINI_API_KEY")
		model := os.Getenv("GEMINI_API_MODEL")

		// Parse client limit with fallback to default
		clientLimit := 100
		if limitStr := os.Getenv("GEMINI_CLIENT_LIMIT"); limitStr != "" {
			if limit, err := strconv.Atoi(limitStr); err == nil {
				clientLimit = limit
			} else {
				log.Fatal("Warning: Invalid GEMINI_CLIENT_LIMIT, using default:", err)
			}
		}

		// Parse idle timeout with fallback to default
		idleTimeout := 5
		if timeoutStr := os.Getenv("GEMINI_IDLE_TIMEOUT"); timeoutStr != "" {
			if timeout, err := strconv.Atoi(timeoutStr); err == nil {
				idleTimeout = timeout
			} else {
				log.Fatal("Warning: Invalid GEMINI_IDLE_TIMEOUT, using default:", err)
			}
		}

		// Get background file path and read its contents
		backgroundFilePath := os.Getenv("GEMINI_BACKGROUND_FILE")
		var backgroundContent string

		if backgroundFilePath != "" {
			backgroundBytes, err := os.ReadFile(backgroundFilePath)
			if err != nil {
				log.Fatal("Warning: Failed to read background file:", err)
			} else {
				backgroundContent = string(backgroundBytes)
			}
		}

		instance = &GeminiConfig{
			APIKey:      apiKey,
			Model:       model,
			ClientLimit: clientLimit,
			IdleTimeout: idleTimeout,
			Background:  backgroundContent,
		}
	})
	return instance
}

func GetGeminiConfig() *GeminiConfig {
	if instance == nil {
		return NewGeminiConfig()
	}
	return instance
}
