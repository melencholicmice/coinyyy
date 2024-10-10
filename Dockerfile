FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code and build TypeScript
COPY . .
RUN pnpm run build

# Expose the necessary port
EXPOSE 3000

# Default command: Can be overridden in Docker Compose
CMD ["node", "build/index.js"]
