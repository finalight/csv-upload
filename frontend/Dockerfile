# Use a Node.js base image
FROM node:current-alpine3.21

# Set the working directory in the container
WORKDIR /app/

# Copy package.json and package-lock.json (or yarn.lock, pnpm-lock.yaml)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that Vite uses
EXPOSE 5173

# Optional: Add environment variable for file watching on macOS
ENV CHOKIDAR_USEPOLLING=true

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

