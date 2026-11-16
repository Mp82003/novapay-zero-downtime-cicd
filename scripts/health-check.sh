#!/bin/bash

URL="http://localhost:3000/health"
TOTAL=0
FAILED=0

echo "Starting NovaPay continuous health monitoring..."

while true; do
    TOTAL=$((TOTAL + 1))

    if curl -fsS --max-time 2 "$URL" > /dev/null; then
        echo "[$(date '+%H:%M:%S')] SUCCESS - API healthy"
    else
        FAILED=$((FAILED + 1))
        echo "[$(date '+%H:%M:%S')] FAILED - API unavailable"
    fi

    echo "Total checks: $TOTAL | Failed: $FAILED"
    sleep 1
done
