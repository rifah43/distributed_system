# Stage 1: Build the Angular application
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production --output-path=dist/front-end
FROM nginx:alpine
COPY --from=build /app/dist/front-end /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
