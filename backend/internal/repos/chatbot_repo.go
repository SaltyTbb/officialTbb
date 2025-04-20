package repos

import (
	"context"
	"sync"
	"time"

	"github.com/SaltyTbb/backend/internal/config"
	"github.com/SaltyTbb/backend/internal/consts"
	"github.com/SaltyTbb/backend/internal/logger"
	"github.com/SaltyTbb/backend/internal/mErr"

	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type ChatbotRepository interface {
	Chat(ctx *gin.Context, req string) (message string, err *mErr.MError)
}

type clientInfo struct {
	client       *genai.Client
	model        *genai.GenerativeModel
	session      *ChatSession
	lastAccessed time.Time
}

type ChatSession struct {
	History []*genai.Content
}

type chatbotRepository struct {
	clientPool  map[string]*clientInfo
	mutex       sync.RWMutex
	idleTimeout time.Duration
}

func NewChatbotRepository() ChatbotRepository {
	repo := &chatbotRepository{
		clientPool:  make(map[string]*clientInfo),
		idleTimeout: time.Duration(config.GetGeminiConfig().IdleTimeout) * time.Minute,
	}

	// Start a goroutine to clean up idle clients
	go repo.cleanupIdleClients()

	return repo
}

func (r *chatbotRepository) cleanupIdleClients() {
	ticker := time.NewTicker(time.Duration(config.GetGeminiConfig().IdleTimeout) * time.Minute)
	defer ticker.Stop()

	for {
		<-ticker.C
		r.mutex.Lock()
		now := time.Now()

		for ip, info := range r.clientPool {
			if now.Sub(info.lastAccessed) > r.idleTimeout {
				info.client.Close()
				delete(r.clientPool, ip)
			}
		}

		r.mutex.Unlock()
	}
}

func (r *chatbotRepository) getOrCreateClient(ip string) (*clientInfo, *mErr.MError) {
	// First check if client already exists
	r.mutex.RLock()
	info, exists := r.clientPool[ip]
	clientCount := len(r.clientPool)
	r.mutex.RUnlock()

	// If client exists, update last accessed time and return
	if exists {
		r.mutex.Lock()
		info.lastAccessed = time.Now()
		r.mutex.Unlock()
		return info, nil
	}

	// Check if pool limit is reached
	clientLimit := config.GetGeminiConfig().ClientLimit
	if clientCount >= clientLimit && clientLimit > 0 {
		return nil, mErr.New(consts.ERROR_CODE_CLIENT_POOL_FULL, consts.ERROR_MESSAGE_CLIENT_POOL_FULL)
	}

	// Create new client
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(config.GetGeminiConfig().APIKey))
	if err != nil {
		return nil, mErr.New(consts.ERROR_CODE_INTERNAL_ERROR, consts.ERROR_MESSAGE_INTERNAL_ERROR)
	}

	model := client.GenerativeModel(config.GetGeminiConfig().Model)

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(config.GetGeminiConfig().Background),
		},
		Role: "system",
	}

	r.mutex.Lock()
	// Check limit again inside the lock to prevent race conditions
	if len(r.clientPool) >= clientLimit && clientLimit > 0 {
		client.Close()
		r.mutex.Unlock()
		return nil, mErr.New(consts.ERROR_CODE_CLIENT_POOL_FULL, consts.ERROR_MESSAGE_CLIENT_POOL_FULL)
	}

	r.clientPool[ip] = &clientInfo{
		client:       client,
		model:        model,
		lastAccessed: time.Now(),
		session: &ChatSession{
			History: []*genai.Content{},
		},
	}
	r.mutex.Unlock()

	return r.clientPool[ip], nil
}

func (r *chatbotRepository) Chat(ctx *gin.Context, req string) (message string, err *mErr.MError) {
	ip := ctx.ClientIP()

	clientInfo, err := r.getOrCreateClient(ip)
	if err != nil {
		logger.WithTraceID(ctx).Error().Err(err).Msg("Failed to create client")
		return "", mErr.New(consts.ERROR_CODE_INTERNAL_ERROR, consts.ERROR_MESSAGE_INTERNAL_ERROR)
	}

	cs := clientInfo.model.StartChat()
	cs.History = clientInfo.session.History

	// Log the request message
	logger.WithTraceID(ctx).Info().Str("request", req).Str("ip", ip).Msg("Request sent to Gemini")

	response, errr := cs.SendMessage(ctx.Request.Context(), genai.Text(req))
	if errr != nil {
		logger.WithTraceID(ctx).Error().Err(errr).Msg("Failed to generate content")
		return "", mErr.New(consts.ERROR_CODE_INTERNAL_ERROR, consts.ERROR_MESSAGE_INTERNAL_ERROR)
	}

	text, ok := response.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		logger.WithTraceID(ctx).Error().Msg("Failed to cast message to string")
		return "", mErr.New(consts.ERROR_CODE_INTERNAL_ERROR, consts.ERROR_MESSAGE_INTERNAL_ERROR)
	}

	// Log the response from Gemini
	responseText := string(text)
	logger.WithTraceID(ctx).Info().Str("response", responseText).Str("ip", ip).Msg("Response received from Gemini")

	clientInfo.session.History = append(clientInfo.session.History, response.Candidates[0].Content)

	return responseText, nil
}
