package mErr

type MError struct {
	Message   string `json:"message"`
	ErrorCode int    `json:"error_code"`
}

func New(code int, message string) *MError {
	return &MError{
		Message:   message,
		ErrorCode: code,
	}
}

func (e *MError) Error() string {
	return e.Message
}

func (e *MError) Code() int {
	return e.ErrorCode
}
