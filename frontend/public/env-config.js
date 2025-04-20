// This file is for local development
// It will be overridden in production by docker-entrypoint.sh

window._env_ = {
  // Default env variables for local development
  REACT_APP_API_BASE_URL: "http://localhost:8000",
  REACT_APP_API_TIMEOUT: "10000"
}; 