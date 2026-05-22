FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY conf ./conf
COPY src ./src
# openapi.yaml is under conf/

EXPOSE 3000

ENV PORT=3000
ENV REDIS_HOST=redis

CMD ["npm", "start"]
