if(process.env.NODE_ENV === 'production'){
    module.exports = {url: 'https://node-jwtauth.herokuapp.com/api/login'};
  } else {
    module.exports = {url: 'http://localhost:3000/api/login'};
  }