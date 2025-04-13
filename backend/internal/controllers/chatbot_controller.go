package controllers

import (
	"net/http"

	"github.com/SaltyTbb/backend/internal/consts"
	"github.com/SaltyTbb/backend/internal/models"
	"github.com/SaltyTbb/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ChatbotController interface {
	Chat(c *gin.Context)
}

type chatbotController struct {
	chatbotService services.ChatbotService
}

func NewChatbotController(chatbotService services.ChatbotService) ChatbotController {
	return &chatbotController{
		chatbotService: chatbotService,
	}
}

func (c *chatbotController) Chat(ctx *gin.Context) {
	req := &models.ChatbotReq{}
	if err := ctx.ShouldBindJSON(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var response *models.ChatbotResp
	message, err := c.chatbotService.Chat(ctx, req)
	if err != nil {

		switch err.Code() {
		case consts.ERROR_CODE_CLIENT_POOL_FULL:
			response = &models.ChatbotResp{
				Response: models.Response{
					Code:    http.StatusServiceUnavailable,
					Status:  "service unavailable",
					Message: err.Error(),
				},
				Data: "Oops! The server is currently at capacity. Please try again later.",
			}
		case consts.ERROR_CODE_INTERNAL_ERROR:
			response = &models.ChatbotResp{
				Response: models.Response{
					Code:    http.StatusInternalServerError,
					Status:  "internal server error",
					Message: err.Error(),
				},
				Data: "Oops! Something went wrong in the backend server. Please try again later.",
			}
		}
		ctx.JSON(response.Code, response)
		return
	}

	response = &models.ChatbotResp{
		Response: models.Response{
			Code:    http.StatusOK,
			Status:  "ok",
			Message: "success",
		},
		Data: message,
	}
	ctx.JSON(response.Code, response)
}
