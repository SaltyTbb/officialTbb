package config

import "sync"

type GeminiConfig struct {
	APIKey      string `json:"api_key"`
	Model       string `json:"model"`
	ClientLimit int    `json:"client_limit"`
	IdleTimeout int    `json:"idle_timeout"`
}

var once sync.Once
var instance *GeminiConfig

func NewGeminiConfig(apiKey string, model string, clientLimit int, idleTimeout int) *GeminiConfig {
	once.Do(func() {
		instance = &GeminiConfig{APIKey: apiKey, Model: model, ClientLimit: clientLimit, IdleTimeout: idleTimeout}
	})
	return instance
}

func GetGeminiConfig() *GeminiConfig {
	if instance == nil {
		panic("GeminiConfig not initialized")
	}
	return instance
}
