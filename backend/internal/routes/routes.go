package routes

import (
	"net/http"
	"time"

	"github.com/SaltyTbb/backend/internal/controllers"
	"github.com/SaltyTbb/backend/internal/logger"
	"github.com/SaltyTbb/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func initAndSetupMiddleware(router *gin.Engine) {
	// Initialize logger
	logger.Init()

	// Setup middleware
	router.Use(middleware.Logger())
	router.Use(middleware.CorsMiddleware())
	router.Use(middleware.IPRestrictionMiddleware())
	router.Use(gin.Recovery())
}

func SetupRoutes(router *gin.Engine) {

	initAndSetupMiddleware(router)

	router.GET("/health", healthCheck)

	v1 := router.Group("/api/v1")
	{
		v1.GET("/health", healthCheck)
		v1.POST("/chat", controllers.GetChatbotController().Chat)
	}
}

// healthCheck handles the health check endpoint
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "up",
		"timestamp": time.Now().Format(time.RFC3339),
		"service":   "tbb-backend-api",
		"version":   "0.1.0",
	})
}
