# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install net-tools and iproute2 for debugging (optional)
RUN apt-get update && apt-get install -y net-tools iproute2

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies including nodemon
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 1000

# Use npx to run nodemon
CMD ["npx", "nodemon", "src/server.js"]
