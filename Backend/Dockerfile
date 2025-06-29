# Dockerfile
FROM node:22

WORKDIR /server

# Copy only package files first to cache npm install
COPY package*.json ./
RUN npm install

# Now copy the rest of the files
COPY . .

# Expose Express ports
EXPOSE 3000

# Start both Vite (frontend) and Express (backend)
CMD ["npm", "start"]
