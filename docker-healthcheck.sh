#!/bin/sh
# Docker health check script for Smart English Grade 4

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "nginx is not running"
    exit 1
fi

# Check if the application is responding
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "Application is not responding"
    exit 1
fi

# Check if static files are accessible
if ! curl -f http://localhost/index.html > /dev/null 2>&1; then
    echo "Static files are not accessible"
    exit 1
fi

# Check if API is accessible (if backend is available)
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "API is healthy"
else
    echo "API is not available (this is expected for frontend-only deployment)"
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if [ "$(echo "$MEMORY_USAGE > 90" | bc)" -eq 1 ]; then
    echo "Memory usage is too high: ${MEMORY_USAGE}%"
    exit 1
fi

# Check disk usage
DISK_USAGE=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "Disk usage is too high: ${DISK_USAGE}%"
    exit 1
fi

echo "All health checks passed"
exit 0
