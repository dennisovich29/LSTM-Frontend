# ────── 1️⃣  BUILD STAGE ───────────────────────────────────────
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Now copy rest of the app
COPY . .

# Expose Vite's dev server port
EXPOSE 5173

# Start Vite dev server with host binding
CMD ["npm", "run", "dev", "--", "--host"]
