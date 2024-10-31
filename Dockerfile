FROM node:19.0.1

WORKDIR /app

COPY /backend /app/

RUN npm install 

EXPOSE 5001

CMD [ "node", "index.js" ]
