package middleware

import (
	"net"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// IPRestrictionMiddleware creates a middleware that only allows requests from specified IPs
// If ALLOWED_IPS is not set or is "*", all IPs are allowed
// Otherwise, only IPs in the comma-separated list are allowed
func IPRestrictionMiddleware() gin.HandlerFunc {
	allowedIPs := getAllowedIPs()

	return func(c *gin.Context) {
		// If all IPs are allowed, proceed
		if len(allowedIPs) == 0 {
			c.Next()
			return
		}

		// Get client IP
		clientIP := c.ClientIP()

		// Check if client IP is allowed
		if !isIPAllowed(clientIP, allowedIPs) {
			c.JSON(http.StatusForbidden, gin.H{
				"code":    http.StatusForbidden,
				"status":  "forbidden",
				"message": "Access denied: Your IP is not allowed",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// getAllowedIPs returns the list of allowed IPs from environment variable
func getAllowedIPs() []string {
	allowedIPsEnv := os.Getenv("ALLOWED_IPS")

	// If not set or set to "*", allow all IPs
	if allowedIPsEnv == "" || allowedIPsEnv == "*" {
		return nil
	}

	// Parse comma-separated list
	allowedIPs := strings.Split(allowedIPsEnv, ",")

	// Trim spaces
	for i, ip := range allowedIPs {
		allowedIPs[i] = strings.TrimSpace(ip)
	}

	return allowedIPs
}

// isIPAllowed checks if the given IP is in the allowed list
func isIPAllowed(clientIP string, allowedIPs []string) bool {
	// Special case for Docker internal networking
	if strings.HasPrefix(clientIP, "172.") && os.Getenv("ALLOW_DOCKER_INTERNAL") == "true" {
		return true
	}

	// Check for exact match
	for _, ip := range allowedIPs {
		// Check if the IP is a CIDR range
		if strings.Contains(ip, "/") {
			_, ipNet, err := net.ParseCIDR(ip)
			if err == nil {
				clientIPParsed := net.ParseIP(clientIP)
				if ipNet.Contains(clientIPParsed) {
					return true
				}
			}
		} else if ip == clientIP {
			return true
		}
	}

	return false
}
