package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/SaltyTbb/backend/internal/controllers"
	"github.com/SaltyTbb/backend/internal/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set Gin to release mode in production
	gin.SetMode(gin.ReleaseMode)

	// Create a new Gin router
	router := gin.Default()

	controllers.InitAllController(router)

	routes.SetupRoutes(router)

	// Define server port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	// Start the server in a goroutine
	go func() {
		log.Printf("Server starting on port %s...\n", port)
		if err := router.Run(":" + port); err != nil {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Server shutting down...")
}
