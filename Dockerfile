# Multi-stage Dockerfile for Smart English Grade 4
# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine AS production

# Install additional tools for monitoring
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create health check script
COPY docker-healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-healthcheck.sh

# Set up health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD /usr/local/bin/docker-healthcheck.sh

# Expose port
EXPOSE 80

# Add labels for monitoring
LABEL maintainer="Smart English Team" \
      version="1.0.0" \
      description="Smart English Grade 4 Learning Platform" \
      healthcheck="curl -f http://localhost/health || exit 1"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
