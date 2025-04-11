# Use an official Node.js runtime as a parent image (LTS Alpine recommended for size)
FROM node:lts-alpine AS development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
# Use wildcard to handle both lock files if needed
COPY package*.json ./

# Install app dependencies
# Using --only=development ensures devDependencies are installed for start:dev
RUN npm install --only=development

# Copy the rest of the application source code
# This will be overridden by the volume mount in docker-compose for development
COPY . .

# The NestJS app listens on port 3000 by default
EXPOSE 3000

# Command to run the app in development mode with hot-reloading
# This will be the default command if not overridden in docker-compose
CMD ["npm", "run", "start:dev"]