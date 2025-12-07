#!/bin/bash

BACKEND_DIR="/var/www/niesmiertelnik/backend"

echo "[INFO] Killing old backend processes..."
pkill -f "$BACKEND_DIR/server.js"

echo "[INFO] Starting backend..."
cd "$BACKEND_DIR"
node server.js
