# Dockerfile
FROM node:22

WORKDIR /app

# Copy only package files first to cache npm install
COPY package*.json ./
RUN npm install

# Now copy the rest of the files
COPY . .

# Expose Vite and Express ports
EXPOSE 5173

# Start both Vite (frontend)
CMD ["npm", "run", "dev"]
