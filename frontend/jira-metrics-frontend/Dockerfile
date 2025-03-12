# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the entire frontend project
COPY . .

# Ensure node_modules is correctly linked inside the container
RUN ln -s /app/node_modules node_modules

# Build the frontend
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
