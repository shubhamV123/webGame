# jwt-NodeJS
A simple jwt based mock authentication in nodeJs as well as image thumbnail generation from public url.
[Demo](https://node-jwtauth.herokuapp.com/)

## Installation
This is a [Node.js](https://nodejs.org/en/) based application.

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Once node installation is done.

Download or clone the project:

```bash
$ git clone https://github.com/shubhamV123/jwt-NodeJS.git
```
##### Note: change directory to jwt-NodeJs before going further installation.



Install dependencies:

```bash
$ npm install
```
Start the server:

If you have installed nodemon then simply type:

```bash
$ nodemon
```
Find more information about nodemon [nodemon](https://github.com/remy/nodemon).

Or else simply type:

```bash
$ node index.js
```

## Login Credentials

Since it is a mock authentication. You can either use any of these credentials for login:


```bash
name: 'john123',                   
password: '12345'                           
```
or

```bash
name: 'test',
password: 'test                           
```

## Logging/Monitoring

This app is centralized with logging system.This app uses simple and universal logging library 
i.e [winston](https://github.com/winstonjs/winston).So just dont use console.log as it would not be 
benficial for debugging/monitoring your application.This app logs all your logging action which you want and it also saves your logs for future reference.Besides this it generate two log files: One contain all logs and another contain only error logs.

More information you can find [here](https://github.com/winstonjs/winston)

## Dockerizing this web app

To know more information about how to get a Node.js application into a Docker container.Follow this [link](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/).
As this app contain docker file you can build your docker image and run this image in docker container.
To build docker image of this:

```bash
docker build -t node-web-app(or any name which your want) .                         
```
To run this docker image:

```bash
docker run -p 8081:3000 -d node-web-app((or name which you set))                         
```
##### Note: If docker gives error during any phase try to run as sudo access.

## Test Suite
This app uses mocha and chai to generate test cases and istanbul for code coverage.
To run test suite:
```bash
$ npm test or mocha                        
```

To run code coverage:
```bash
$ npm run coverage                        
```

## Extra Notes

To use javascript linter on this project download eslint globally :

```bash
npm install -g eslint                          
```

After that you can lint your application using eslint filename.js
