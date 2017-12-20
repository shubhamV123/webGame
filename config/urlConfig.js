//url for local and development versions
if(process.env.NODE_ENV === 'production'){
    module.exports = {url: 'https://floating-headland-47675.herokuapp.com'};
  } else {
    module.exports = {url: 'http://localhost:3000'};
  }