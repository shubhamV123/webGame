//url for local and development versions
if(process.env.NODE_ENV === 'production'){
    module.exports = {url: 'https://node-jwtauth.herokuapp.com'};
  } else {
    module.exports = {url: 'http://localhost:3000'};
  }