let chai = require('chai');
let assert = chai.assert; // Using Assert style
let expect = chai.expect; // Using Expect style
let should = chai.should();
let chaiHttp = require('chai-http');
const logger = require('../utils/logger');

const urlConfig = require('../config/urlConfig');
chai.use(chaiHttp);


let loginDetail = {
  name: 'john123',
  password: '12345'
};
let wrongCredential = [{
  name: '',
  password:''
},{
  name: 'john123',
  password:'123'
},
{
  name: 'john@123',
  password:'123'
}]

describe('/', () => {
  it('it should show the login page', (done) => {
    chai.request(urlConfig.url)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
describe('Show error', () => {
  it('it should show error as wrong credential is given', (done) => {
    chai.request(urlConfig.url)
      .post('/api/login')
      .send(wrongCredential[0])
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; 
        res.body.should.be.a('object'); 
        res.body.should.have.property('error'); 
        res.body.should.have.property('message'); 
        res.body.error.should.be.true; 
        res.body.message.should.equal('Please fill all the fields' ); 
        logger.info(res.body)
        done();
      });
  });
});
describe('Show error', () => {
  it('it should show error as wrong credential is given', (done) => {
    chai.request(urlConfig.url)
      .post('/api/login')
      .send(wrongCredential[1])
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; 
        res.body.should.be.a('object'); 
        res.body.should.have.property('error'); 
        res.body.should.have.property('message'); 
        res.body.error.should.be.true; 
        res.body.message.should.equal('Password must be 4 character length and more'); 
        logger.info(res.body)
        done();
      });
  });
});
describe('Show error', () => {
  it('it should show error as wrong credential is given', (done) => {
    chai.request(urlConfig.url)
      .post('/api/login')
      .send(wrongCredential[2])
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; 
        res.body.should.be.a('object'); 
        res.body.should.have.property('error'); 
        res.body.should.have.property('message'); 
        res.body.error.should.be.true; 
        res.body.message.should.equal('Only alphabets and numbers are allowed'); 
        logger.info(res.body)
        done();
      });
  });
});
describe('Show unauthorized profile request', () => {
  it('If token is invalid or not set it display unauthorized', (done) => {
    chai.request(urlConfig.url)
      .get('/profile')
      .end((err, res) => {
        res.should.have.status(401);
        logger.warn('Unauthorized')
        done();
      });
  });
});
describe('Show unauthorized for create request', () => {
  it('If token is invalid or not set it display unauthorized', (done) => {
    chai.request(urlConfig.url)
      .get('/create')
      .end((err, res) => {
        res.should.have.status(401);
        logger.warn('Unauthorized')
        done();
      });
  });
});

describe('/POST Login', () => {
  it('it should  Login, and check token', (done) => {

    // follow up with login
    chai.request(urlConfig.url)
      .post('/api/login')
      .send(loginDetail)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('token');
        let token = res.body.token;
        chai.request(urlConfig.url)
          .get('/api/secret')
          // we set the auth header with our token
          .set('authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');

            done(); // Don't forget the done callback to indicate we're done!
          })
      })


  })
})