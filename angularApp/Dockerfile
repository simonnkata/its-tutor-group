FROM node:22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run ng build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist/angular-app .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# The default CMD for Nginx runs it in the foreground
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
