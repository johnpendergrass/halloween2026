"""Serve Halloween 2026 locally with development-friendly caching.

Use start-halloween.bat beside this file - it does everything for you. This
script can also be run directly, from ANY working directory: it serves the
PROJECT ROOT (this file's parent folder), where index.html lives.

    python start-local/no-cache-server.py --port 9000

Adapted from triageRush's server. TWO CACHING RULES:

  CODE (html, js, css, json) -> no-store. Never kept, so a reload always
                                runs the file you just edited.

  ART and SOUND (under an assets/ folder) -> no-cache. Kept, but re-checked
                                on every request: a replaced file comes back
                                fresh, an unchanged one costs no download.
                                ("Never cache anything" broke preloading in
                                triageRush - this is the fix.)

Nothing in start-local/ is needed by GitHub Pages; it is for this PC only.
"""

from argparse import ArgumentParser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# The site root is start-local/.. - where index.html is.
SITE_ROOT = Path(__file__).resolve().parent.parent


class HalloweenRequestHandler(SimpleHTTPRequestHandler):
    """Serve code uncached and art revalidated; see the module docstring."""

    def _is_asset(self) -> bool:
        """True for anything inside an assets/ folder (art, sound)."""
        path = self.path.split("?", 1)[0]
        return "/assets/" in path

    def end_headers(self) -> None:
        if self._is_asset():
            self.send_header("Cache-Control", "no-cache")
        else:
            self.send_header("Cache-Control",
                             "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()


def main() -> None:
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--bind", default="0.0.0.0", help="Address to bind")
    parser.add_argument("--port", type=int, default=8091, help="Port to listen on")
    args = parser.parse_args()

    if not (SITE_ROOT / "index.html").exists():
        raise SystemExit(
            f"No index.html in {SITE_ROOT}\n"
            "This script expects to sit in start-local/ inside the project.")

    handler = partial(HalloweenRequestHandler, directory=str(SITE_ROOT))
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    print(f"Halloween 2026: serving {SITE_ROOT}")
    print(f"                http://localhost:{args.port}/   (ctrl-C to stop)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
