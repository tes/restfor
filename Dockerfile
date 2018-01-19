FROM node:latest

WORKDIR /restfor

ADD package.json /restfor/package.json
ADD package-lock.json /restfor/package-lock.json

RUN npm install

ADD config /restfor/config
ADD public /restfor/public
ADD server /restfor/server
ADD src /restfor/src

ENV NODE_ENV=production

RUN npm run build

CMD npm run server