#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "Starting BUS5001 ESG prototype app..."
echo "Open http://localhost:8000 in your browser."
python3 -m http.server 8000
