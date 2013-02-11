// eventually, you'll have some code here that uses the tested helpers 
// to actually download the urls you want to download.
var helper = require('./lib/html-fetcher-helpers');

helper.readUrls(helper.downloadUrls);
