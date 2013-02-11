var fs = require('fs');
var querystring = require('querystring');
var utils = require('utils');
var parser = require('url');
var dataPath = "../data/";

exports.handleRequest = function (req, res, outputOverride) {
  //Deliver index.html and styles.css
  if(req.method === 'GET' && (req.url === "/index.html"  || req.url === "/styles.css" || req.url === "/" || req.url === "/main.js" || req.url === "/favicon.ico") ){
    var fileName = req.url.slice(1);
    deliverStatic(req, res, fileName);
  }else if(req.method === 'GET' && req.url === '/siteList'){  
    deliverSiteList(res);
  }else if(req.method === 'GET'){
    //Check if we are looking for versionLists  
    if( req.url.indexOf('/versionList') >= 0){
      console.log("The URL is:" + req.url); 
      var url_parts = parser.parse(req.url, true);
      var query = url_parts.query;
      console.log("The querry Site = " + query.sitename);
      deliverVersionsList(res, query.sitename);
    }else if(req.url.indexOf('/displaySpecificVersion') >= 0){
      var url_parts = parser.parse(req.url, true);
      var query = url_parts.query;
      deliverSpecificVersion(res, query.sitename, query.version);
    }else if(!inValidURL(req.url)){
      deliverLatestCopyOfSite(res, req.url);
    }
    else{
      //we don't want to try to deliver it
      res.writeHead(404);
      res.end();
    }
  }
  if(req.method === 'POST'){
    var siteName = parser.parse(req.url);
    
    var fullBody = '';
    req.on("data", function(chunk){
      fullBody += chunk;
    });
    req.on("end", function(){
      res.writeHead(302, "OK", {
        'Content-Type': 'text/html',
        'Location': "/"});
      var decodedBody =querystring.parse(fullBody);
      addSiteArchive(res, decodedBody.url);
      res.end();
    });
  }
};
var inValidURL = function (url){
  var myReg = /\/[a-zA-Z\d-._]*\//;
  return (myReg.test(url));
};

var deliverSiteList = function (res){
  console.log("deliverSiteList Called");
  fs.readFile(dataPath + "sites.txt", function(err, data) {
    if(err){console.log(err);}
    var sitesArray = data.toString('utf-8').split('\n');
    res.end(JSON.stringify(sitesArray));
  });
};

var deliverVersionsList = function(res, siteName){
  var versionList = fs.readdirSync(dataPath +"/sites/"+ siteName);
  console.log(versionList);
  if(versionList.length > 1) {versionList.shift();};
  res.end(JSON.stringify(versionList));
 
};

var addSiteArchive = function(res, siteName){
  fs.appendFile(dataPath + 'sites.txt', "\n" + siteName, function(err){
    if(err){console.log(err);}
    console.log("It worked" + siteName);
  });
};

var deliverSpecificVersion = function(res, siteName, version){
  console.log("I made it to displaySpecificVersion");
  var pathToFile = dataPath + 'sites/' + siteName + '/' + version;
  fs.readFile(pathToFile, function(err, data){
    if(err){
      console.log(err);
      res.writeHead(404);
      res.end();
    }
    else{
      res.writeHead(200);
      res.end(data.toString('utf-8'));
    }
  });
};

var deliverLatestCopyOfSite = function(res, siteName){
  var siteData = null;
  var pathToFiles = dataPath + 'sites' + siteName;
  //console.log("ThePathToTheFiles IS:" + pathToFiles);
  var versionFiles = fs.readdirSync(pathToFiles);

  //console.log("The File List for "+ siteName +" is:" + versionFiles)
  fs.readFile(dataPath + 'sites'+siteName +"/"+ versionFiles[1], function(err, data){
    if(err){
      console.log(err);
      res.writeHead(404);
      res.end();
    }else{
      var statusCode = 200;
      res.writeHead(statusCode, {
        contentType: 'text/html'
      });
      siteData = data.toString('utf-8');
      //console.log("SiteData is: " + siteData);
      res.end(siteData);
    }
  });
};


var deliverStatic = function(req, res, fileName) {
  console.log("deliverStaticCalled: "+ fileName);
  var staticResource;
  if(fileName === ''){
    fileName = "index.html";
  }
  fs.readFile('../web/public/'+fileName, function(err, data){
    if(err){  
      console.log(err);
      res.end(500);
    }else{
      var statusCode = 200;
      res.writeHead(statusCode);
      staticResource = data;
      // console.log("Before:" + staticResource);
      staticResource = staticResource.toString('utf-8');
      // console.log("After:" + staticResource);
      res.end(staticResource);
    }
  });
};