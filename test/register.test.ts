import app from "../src/main";
import request from 'supertest';
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;



describe('Index Route Test /', function () {
    it('should return 200 OK', function (done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .expect(200, done);
    });
});



describe("# Register API Test", () => {

    it("should add provider information", () => {
        return request(app)
            .post('/register')
            .send({"firstName": "Alex", "lastName": "Bob", "NPINumber": 1902809197, "IsFullInfo": false})
            .expect(res =>{
               res.text.includes("You have been successfully registered.");
              // res.body.message.should.equal("You have been successfully registered.");
            }).expect(200);
    });

    it("should not add provider when no data is sent", () => {
        return request(app)
            .post('/register')
            .send({})
            .expect(res => {
                 res.text.includes("Sorry, we can not proceed with an empty data.");
                // res.body.message.should.equal("Sorry, we can not proceed with an empty data.");
            })
            .expect(200);
    });
});
