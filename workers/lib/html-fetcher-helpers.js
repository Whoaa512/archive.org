var fs = require("fs");
var http = require('http-get');

exports.readUrls = function(cb){
  fs.readFile("/Users/Catalyst/code/archive.org/data/sites.txt", function(err, data) {
    if(err){console.log(err);}
    var sitesArray = data.toString('utf-8').split('\n');
    cb(sitesArray);
  });
};

exports.downloadUrls = function(urls){
  var dataPath = "/Users/Catalyst/code/archive.org/data/sites/";
  urls.forEach(function(site) {
  fs.readdir(dataPath, function(err, dirNames) {
      if(dirNames.indexOf(site) === -1){
        fs.mkdir(dataPath+site);
      }
      fs.readdir(dataPath+site, function(err, versionList) {
        writeToFile(site, dataPath,versionList);
      });
    });    
  });
};

var writeToFile = function(site, dataPath, versionList) {
  var currentTime = new Date(),
      days        = 1;
  if(versionList.length > 0){
    var difference = 0;
    console.log("The Last Version is:" + versionList[versionList.length - 1]);
    difference = currentTime - new Date(versionList[versionList.length - 1]);
    days = Math.round(difference/(1000*60*60*24));
    console.log("Days is:" + days);
  }
  
  if(days > 0){
    http.get('http://'+ site, dataPath+site+'/'+currentTime, function(error, result){
      if (error){
        console.log(result);
        console.log("Something Bad Happened: " + error);
      }else{
        console.log('File downloaded at: ' + result.file);
      }
    });
  }
};