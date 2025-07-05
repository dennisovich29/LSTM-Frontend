# ────── 1️⃣  BUILD STAGE ───────────────────────────────────────
FROM node
WORKDIR /app

# copy only package manifests first, so dependencies are cached
COPY . /app
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
