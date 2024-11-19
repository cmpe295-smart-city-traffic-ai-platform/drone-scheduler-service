FROM node:19.0.1

WORKDIR /app

COPY ./ /app/

ENV NODE_ENV=production

RUN npm install --force || true

RUN npm run build || true

WORKDIR /app/backend

RUN npm install 

EXPOSE 5001

CMD [ "node", "index.js" ]
