FROM node:lts-jessie

RUN apt-get update 

WORKDIR /usr/src/3-patti-telegeram/

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]