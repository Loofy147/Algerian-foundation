# ---- Base Stage ----
FROM public.ecr.aws/k9x5n2l5/shopper-node-18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# ---- Dependencies Stage ----
FROM base AS dependencies
RUN npm install --omit=dev

# ---- Build Stage ----
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM public.ecr.aws/k9x5n2l5/shopper-node-18-alpine AS production
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
