# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application source code
# This will be overridden by the volume mount in docker-compose for development
COPY . .

# Next.js default port is 3000
EXPOSE 3000

# Command to run the app in development mode
# This will be the default command if not overridden in docker-compose
CMD ["npm", "run", "dev"]

