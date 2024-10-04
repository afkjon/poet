FROM node:22-alpine3.19

WORKDIR /app

COPY ./frontend/package*.json ./

RUN apk add --no-cache bash && \
    npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]