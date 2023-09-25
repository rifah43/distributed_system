FROM node:18-alpine as build

WORKDIR /app

COPY package.json ./
RUN npm install
Run npm install -g @angular/cli

COPY . .
RUN npm run build
EXPOSE 4200

CMD ["ng","serve","--host","0.0.0.0"]