if(process.env.NODE_ENV === 'production'){
    module.exports = {url: 'mongodb://root:root@ds231245.mlab.com:31245/poker'};
  } else {
    module.exports = {url: 'mongodb://localhost/poker'};
  }