# image
FROM node:11.13.0-alpine

#ENV APP_ROOT /usr/src/nuxt-app

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=3003

# create destination directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/app/
RUN npm install

## Reset the tables
RUN npm run reset-db

## Create the tables
RUN npm run migrate-db

## Populate the database
RUN npm run populate-db

# expose 3003 on container
EXPOSE 3003

# start the app
CMD [ "npm", "start" ]
