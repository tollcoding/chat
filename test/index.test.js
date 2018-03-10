var assert = require("assert");

describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

var express = require("express");
var request = require("supertest");
var toboggan = require("toboggan")(request);
var app = express();
var router = express.Router();

app.use(router);

describe("Routes", function() {
  describe("GET Users", function() {
    it("should respond", function() {
      request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect("Content-Length", "15")
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
        });
    });
  });
});

var request = require("supertest");
describe("loading express", function() {
  var server;
  beforeEach(function() {
    server = require("app");
    this.timeout(15000);
  });
  /*    afterEach(function () {
        server.close();
    }); */
  it("responds to /", function testSlash(done) {
    this.timeout(10000);
    request(server)
      .get("/")
      .expectTemplate("frontpage")
      .expect(200, done);
  });
  it("404 everything else", function testPath(done) {
    this.timeout(10000);
    request(server)
      .get("/foo/bar")
      .expect(404, done);
  }),
    it("should take less than 500ms", function(done) {
      this.timeout(500);
      setTimeout(done, 300);
    });
});
after(() => {
  process.exit();
});
