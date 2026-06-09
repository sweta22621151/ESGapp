from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = 8000

if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    print(f"Serving BUS5001 ESG prototype from: {root}")
    print(f"Open http://localhost:{PORT} in your browser")
    server = ThreadingHTTPServer(("", PORT), SimpleHTTPRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
