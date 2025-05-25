# Dockerfile
FROM node:18

WORKDIR /app

# Copy only package files first to cache npm install
COPY package*.json ./
RUN npm install

# Now copy the rest of the files
COPY . .

# Expose Vite and Express ports
EXPOSE 5173
EXPOSE 3001

# Start both Vite (frontend) and Express (backend)
CMD ["npm", "run", "dev"]
