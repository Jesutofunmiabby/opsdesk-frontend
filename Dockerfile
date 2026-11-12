# Two stages: the first uses Node to build the React app into plain HTML, CSS
# and JavaScript files; the second serves those files with nginx. The final
# image has no Node, no node_modules and no source code, only the built files.

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first. Docker reuses this layer until package.json or
# package-lock.json changes, so a code change does not reinstall everything.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite writes VITE_API_URL into the JavaScript when it builds, not when the
# app runs, so it must be given here as a build argument. Changing it means
# building the image again.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Stage 2: serve ----
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
