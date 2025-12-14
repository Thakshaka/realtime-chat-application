# Multi-stage build for React application
# Stage 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
