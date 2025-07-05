# ────── 1️⃣  BUILD STAGE ───────────────────────────────────────
FROM node
WORKDIR /app

# copy only package manifests first, so dependencies are cached
COPY . /app
RUN npm install

EXPOSE 5173
CMD ["npm", "run","start"]
