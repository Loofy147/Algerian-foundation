# Use an official Node.js runtime as a parent image
FROM public.ecr.aws/k9x5n2l5/shopper-node-18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npm run build

# Make port 80 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["node", "dist/index.js"]
