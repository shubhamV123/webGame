# jwt-NodeJS
A simple jwt based mock authentication in nodeJs as well as image thumbnail generation from public url.

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
password: '123'                           
```
or

```bash
name: 'test',
password: 'test                           
```

## Logging/Monitoring

This app is centralized with logging system.This app uses simple and universal logging library 
i.e [winston](https://github.com/winstonjs/winston).So just dont use console.log as it would not be 
benficial for debugging/monitoring your application.This app logs all your logging action which you want and it also saves your logs for future refrence.Beside this it generate two log files: One contain all logs and another contain only error log.

More information you can find [here](https://github.com/winstonjs/winston)

## Extra Notes

To use javascript linter on this project download eslint globally :

```bash
npm install -g eslint                          
```

After that you can lint your application using eslint filename.js
