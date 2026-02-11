#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4173}"

echo "Starting local preview server on port ${PORT}..."
echo "Open: http://localhost:${PORT}/index.html"
python3 -m http.server "${PORT}"
