FROM node:10.16.3-jessie

RUN apt-get update 

WORKDIR /usr/src/3-patti-telegeram/

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]