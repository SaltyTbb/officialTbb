package services

import (
	"github.com/SaltyTbb/backend/internal/mErr"
	"github.com/SaltyTbb/backend/internal/models"
	"github.com/SaltyTbb/backend/internal/repos"
	"github.com/gin-gonic/gin"
)

type ChatbotService interface {
	Chat(ctx *gin.Context, req *models.ChatbotReq) (message string, err *mErr.MError)
}

type chatbotService struct {
	chatbotRepository repos.ChatbotRepository
}

func NewChatbotService(chatbotRepository repos.ChatbotRepository) ChatbotService {
	return &chatbotService{chatbotRepository: chatbotRepository}
}

func (s *chatbotService) Chat(ctx *gin.Context, req *models.ChatbotReq) (message string, err *mErr.MError) {
	return s.chatbotRepository.Chat(ctx, req)
}
