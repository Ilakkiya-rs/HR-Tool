import logging
from django.utils.timezone import now

logger = logging.getLogger(__name__)

class APILoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log request metadata
        logger.info(f"Request: {request.method} {request.get_full_path()} at {now()}")

        # Log body only if not multipart (i.e., no file upload)
        content_type = request.content_type or ''
        if not content_type.startswith('multipart/form-data'):
            try:
                logger.info(f"Request Body: {request.body.decode('utf-8')}")
            except UnicodeDecodeError:
                logger.warning("Could not decode request body as UTF-8")

        response = self.get_response(request)

        logger.info(f"Response Status: {response.status_code} at {now()}")
        return response
