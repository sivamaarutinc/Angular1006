FROM node:14.7.0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install cors --save
RUN npm install express --save
RUN npm install -g @angular/cli@9.1.12

# add app
COPY . /app

RUN ng build --prod
# start app
# CMD ng serve --host 0.0.0.0

CMD [ "node", "server.js" ]
# docker changes 12:06 09/16/2020
