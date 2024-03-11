# Use Node.js base image
FROM node:latest

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy remaining project files
COPY . .

# Expose port
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]