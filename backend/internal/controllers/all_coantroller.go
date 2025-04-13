package controllers

import (
	"github.com/SaltyTbb/backend/internal/repos"
	"github.com/SaltyTbb/backend/internal/services"
	"github.com/gin-gonic/gin"
)

var (
	chatbotRepo repos.ChatbotRepository

	chatBotService services.ChatbotService

	chatBotController ChatbotController
)

func InitAllController(router *gin.Engine) {
	chatbotRepo = repos.NewChatbotRepository()
	chatBotService = services.NewChatbotService(chatbotRepo)
	chatBotController = NewChatbotController(chatBotService)
}

func GetChatbotController() ChatbotController {
	return chatBotController
}
