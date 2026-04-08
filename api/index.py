"""
Vercel serverless entry point.
Uses BaseHTTPRequestHandler to avoid Vercel's ASGI scanner bug.
Delegates all requests to FastAPI via async ASGI transport.
"""
from http.server import BaseHTTPRequestHandler
import sys
import os
import json
import asyncio
from urllib.parse import urlparse, unquote

# Add the directory containing this file to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _app import app  # noqa: E402


def _run_asgi(method, path, headers_dict, body=b""):
    """Invoke FastAPI ASGI app synchronously and return (status, headers, body)."""
    parsed = urlparse(path)
    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": method,
        "path": unquote(parsed.path),
        "query_string": (parsed.query or "").encode(),
        "root_path": "",
        "headers": [(k.lower().encode(), v.encode()) for k, v in headers_dict.items()],
        "server": ("localhost", 443),
    }

    status_code = 200
    response_headers = []
    response_body = bytearray()

    async def receive():
        return {"type": "http.request", "body": body, "more_body": False}

    async def send(message):
        nonlocal status_code, response_headers
        if message["type"] == "http.response.start":
            status_code = message["status"]
            response_headers = message.get("headers", [])
        elif message["type"] == "http.response.body":
            response_body.extend(message.get("body", b""))

    loop = asyncio.new_event_loop()
    try:
        loop.run_until_complete(app(scope, receive, send))
    finally:
        loop.close()

    return status_code, response_headers, bytes(response_body)


class handler(BaseHTTPRequestHandler):
    def _handle(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length else b""

            headers_dict = {k: v for k, v in self.headers.items()}

            status_code, resp_headers, resp_body = _run_asgi(
                self.command, self.path, headers_dict, body
            )

            self.send_response(status_code)
            for hdr_name, hdr_val in resp_headers:
                name = hdr_name.decode() if isinstance(hdr_name, bytes) else hdr_name
                val = hdr_val.decode() if isinstance(hdr_val, bytes) else hdr_val
                self.send_header(name, val)
            self.end_headers()
            self.wfile.write(resp_body)
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e), "type": type(e).__name__}).encode())

    def do_GET(self):
        self._handle()

    def do_POST(self):
        self._handle()

    def do_PUT(self):
        self._handle()

    def do_DELETE(self):
        self._handle()

    def do_PATCH(self):
        self._handle()

    def do_OPTIONS(self):
        self._handle()
