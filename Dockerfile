# Define image
FROM node:latest

# Create working directory
RUN mkdir -p /usr/src/TRACer
WORKDIR /usr/src/TRACer

# add `/usr/src/<app>/node_modules/.bin` to $PATH
ENV PATH /usr/src/TRACer/node_modules/.bin:$PATH

# Copy package.json and
# the entire directory over to working directory
COPY package.json /usr/src/TRACer
RUN npm install
COPY . /usr/src/TRACer

# Start
CMD [ "nodemon", "app.js" ]
