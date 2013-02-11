exports.Request = function(url, method, postdata) {
  this.url = url;
  this.method = method;
  this._postData = postdata;
  this.setEncoding = function(type) {
    //ignore
  };
  var self = this;
  this.on = function(type, callback) {
    if (type == "data") {
      // turn postdata (dictionary object) into raw postdata
      // raw postdata looks like this:
      // username=jono&message=do+my+bidding
      var fields = [];
      for (var key in self._postData) {
        fields.push(key + "=" + self._postData[key].replace(" ", "+"));
      }
      callback(fields.join("&"));
    }
    if (type == "end") {
      callback();
    }
  };
};

exports.Response = function() {
  this.ended = false;
  this.responseCode = null;
  this.headers = null;
  this.data = null;
  var self = this;
  this.writeHead = function(responseCode, headers) {
    console.log("WriteHead called with " + responseCode);
    self.responseCode = responseCode;
    self.headers = headers;
  }
  this.end = function(data) {
    console.log("Response.end called.");
    self.ended = true;
    self.data = data;
  }
};

exports.FileWriteStream = function(){
  this.write = function(data){
    this.data = data;
  }
};

exports.FileReadStream = function(streamData){
  this.on = function(e, cb){
    if(e === "data"){
      cb(streamData);
    } else if(e === "end"){
      cb();
    }
  };
};