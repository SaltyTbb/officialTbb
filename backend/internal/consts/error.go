package consts

const (
	ERROR_CODE_INTERNAL_ERROR = 1000 + iota
	ERROR_CODE_CLIENT_POOL_FULL
)

const (
	ERROR_MESSAGE_INTERNAL_ERROR   = "Internal server error"
	ERROR_MESSAGE_CLIENT_POOL_FULL = "Server is at capacity, please try again later"
)
