# Use a smaller base image for the builder stage
FROM node:alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller base image for the final stage
FROM node:alpine

# Set the environment variable for production
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Set environment variables
ENV JWT_SECRET=2553fc861d4b8313724a4169c2f80d204cfd48f6132269a8b8428a7635c74ac3

# Expose the application port
EXPOSE 80

# Run the application
CMD ["node", "dist/server.js"]
