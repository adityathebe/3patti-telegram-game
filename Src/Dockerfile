FROM node:10.16.3-jessie

RUN apt-get update 

WORKDIR /usr/src/3-patti-telegeram/

RUN npm install -g nodemon

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]