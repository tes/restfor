FROM node:latest

WORKDIR /restfor

ADD package.json /restfor/package.json
ADD package-lock.json /restfor/package-lock.json

RUN npm install --production

ADD configs /restfor/configs
ADD build /restfor/build
ADD public /restfor/public
ADD server /restfor/server
ADD src /restfor/src

ENV NODE_ENV=production

CMD npm run server