FROM nginx:alpine
WORKDIR /var/www/html
COPY ./front-end/dist/frontend ./
COPY ./nginx.conf /etc/nginx/conf.d/default.conf