# Use Node.js 22 Alpine as base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY src ./src

# Expose application port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
