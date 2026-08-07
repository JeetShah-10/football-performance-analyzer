from slowapi import Limiter
from slowapi.util import get_remote_address

# Shared Rate Limiter instance (60 requests/minute per client IP)
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
