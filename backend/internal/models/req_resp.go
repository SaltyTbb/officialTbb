package models

type Response struct {
	Code    int    `json:"code"`
	Status  string `json:"status"`
	Message string `json:"message,omitempty"`
}

type ChatbotReq struct {
	Message string `json:"message"`
}

type ChatbotResp struct {
	Response
	Data string `json:"data"`
}
