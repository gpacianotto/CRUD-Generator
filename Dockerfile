# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install the dependencies
RUN yarn install

# Expose the port the app runs on
EXPOSE 3344

# Command to run the application
CMD ["yarn", "start"]
