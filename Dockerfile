# FROM node:alpine
# WORKDIR /usr/yourapplication-name
# COPY package.json .
# RUN npm install\
#     && npm install typescript -g
# COPY . .
# RUN tsc
# CMD ["node", "./dist/server.js"]

FROM node as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:slim

# Install Python and other necessary build tools
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    ln -s /usr/bin/python3 /usr/bin/python

# Set the Python environment variable for node-gyp
ENV PYTHON=/usr/bin/python

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist

ENV JWT_SECRET=2553fc861d4b8313724a4169c2f80d204cfd48f6132269a8b8428a7635c74ac3

RUN ls -la

EXPOSE 80

CMD [ "node", "dist/server.js" ]
