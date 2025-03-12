# Use official Node.js image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first (for better Docker caching)
COPY package.json ./

# Install dependencies before copying the full source code
RUN npm cache clean --force
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# Ensure node_modules is correctly linked inside the container
RUN ln -s /app/node_modules node_modules

# Expose backend port
EXPOSE 5002

# Start the backend server
CMD ["node", "server.js"]
