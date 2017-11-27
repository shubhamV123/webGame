let chai = require('chai');  
let assert = chai.assert;    // Using Assert style
let expect = chai.expect;    // Using Expect style
let should = chai.should(); 
let chaiHttp = require('chai-http');
chai.use(chaiHttp);


let loginDetail = {
    name:'john123',
    password:'12345'
}

describe('/', () => {
    it('it should show the login page', (done) => {
      chai.request('http://localhost:3000')
          .get('/')
          .end((err, res) => {
            res.should.have.status(200);            
            done();
          });
    });
});

describe('/POST Register', () => {
    it('it should Register, Login, and check token', (done) => {
     
          // follow up with login
          chai.request('http://localhost:3000')
            .post('/api/login')
            .send(loginDetail)
            .end((err, res) => {
              console.log('this was run the login part');
              res.should.have.status(200);
              res.should.be.json; 
              res.body.should.be.a('object'); 
            //   res.body.should.have.length('3'); 
            //   expect(res.body.state).to.be.true;
              res.body.should.have.property('token'); 
            //   console.log(expect(res.body.state).to.be.true)
              let token = res.body.token;
              console.log(token)
              // follow up with requesting user protected page
              chai.request('http://localhost:3000')
                .get('/secret')
                // we set the auth header with our token
                .set('Authorization', token)
                .end((err, res) => {
                    // console.log(res.body)
                  res.should.have.status(200);
                //   expect(res.body.state).to.be.true;
                  res.body.should.be.a('object');
 
                  done(); // Don't forget the done callback to indicate we're done!
                })
            // done();
            })
 
        
    })
  })
