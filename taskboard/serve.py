#!/usr/bin/env python3
"""Sand Board: serves index.html and saves tasks to tasks.json. Local only.
Run:  python3 taskboard/serve.py   (add --no-open to skip the browser)"""
import json, os, sys, tempfile, threading, webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "tasks.json")
PORT = int(os.environ.get("PORT", "8765"))
LOCK = threading.Lock()

class H(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype="application/json"):
        if isinstance(body, str): body = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype + "; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = self.path.split("?")[0]
        if p in ("/", "/index.html"):
            with open(os.path.join(HERE, "index.html"), "rb") as f:
                self._send(200, f.read(), "text/html")
        elif p == "/api/tasks":
            with LOCK:
                try:
                    with open(DATA, "rb") as f: self._send(200, f.read())
                except FileNotFoundError:
                    self._send(200, '{"items":[]}')
        else:
            self._send(404, '{"error":"not found"}')

    def do_PUT(self):
        if self.path != "/api/tasks":
            return self._send(404, '{"error":"not found"}')
        n = int(self.headers.get("Content-Length", 0))
        if n > 5_000_000:
            return self._send(413, '{"error":"too large"}')
        try:
            data = json.loads(self.rfile.read(n))
            assert isinstance(data.get("items"), list)
        except Exception:
            return self._send(400, '{"error":"bad json"}')
        with LOCK:
            fd, tmp = tempfile.mkstemp(dir=HERE, suffix=".tmp")
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=1)
            os.replace(tmp, DATA)
        self._send(200, '{"ok":true}')

    def log_message(self, *a): pass

if __name__ == "__main__":
    try:
        srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    except OSError:
        print(f"Port {PORT} is busy. The board may already be running: http://127.0.0.1:{PORT}")
        sys.exit(1)
    url = f"http://127.0.0.1:{PORT}"
    print(f"Sand Board running at {url}  (Ctrl+C to stop)")
    if "--no-open" not in sys.argv:
        threading.Timer(0.4, lambda: webbrowser.open(url)).start()
    try: srv.serve_forever()
    except KeyboardInterrupt: print("\nStopped.")
