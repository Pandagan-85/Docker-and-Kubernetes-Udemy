FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 80

# anonymous volume
# This will create a volume that is not named
# and will be removed when the container is removed
# Volume for persistent data
# folder inside the container
# will be mapped to a volume on the host
# or a named volume
# to allow data persistence
VOLUME ["/app/feedback"]


# Start the application
CMD ["node", "server.js"]



