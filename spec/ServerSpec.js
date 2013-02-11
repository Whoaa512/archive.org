var handler = require("../web/request-handler");
var stubs = require("../specHelpers/stubs");
var res;

// allows us to run tests async
function async(cb){
  waits(200);
  runs(cb);
}

beforeEach(function(){
  res = new stubs.Response();
});

describe("Node Server Request Listener Function", function() {

  it("Should answer GET requests for /", function() {
    var req = new stubs.Request("/", "GET");
    handler.handleRequest(req, res);
    async(function(){
      expect(res.responseCode).toEqual(200);
      expect(res.data).toMatch(/<input/); // the resulting html should have an input tag
      expect(res.ended).toEqual(true);
    });
  });

  it("Should answer GET requests for archived websites", function() {
    var fixtureName = "www.google.com";
    var req = new stubs.Request("/" + fixtureName, "GET");
    handler.handleRequest(req, res);
    async(function(){
      expect(res.responseCode).toEqual(200);
      expect(res.data).toMatch(/google/); // the resulting html should have the text "google"
      expect(res.ended).toEqual(true);
    })
  });

  it("Should accept posts to /", function() {
    var url = "www.example.com";
    var req = new stubs.Request("/", "POST", {url: url});
    var output = new stubs.FileWriteStream();
    handler.handleRequest(req, res, output);
    expect(res.responseCode).toEqual(302);
    expect(res.ended).toEqual(true);
  });

  it("Should 404 when asked for a nonexistent file", function() {
    var req = new stubs.Request("/arglebargle", "GET");
    handler.handleRequest(req, res);
    async(function() {
      expect(res.responseCode).toEqual(404);
      expect(res.ended).toEqual(true);
    });
  });

});
