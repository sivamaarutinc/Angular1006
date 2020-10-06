const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const request = require('request');
var apiUrl = process.env.APIURL;
var scanApiUrl = process.env.SCAN_API_URL;
var cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static(__dirname + '/dist/NIHLwebappA9'));
app.use(bodyParser.urlencoded({ extended: true }));
var apiProxy = httpProxy.createProxyServer();
app.get('/getconfig', function (req, res) {
  try {
    // let data = 'https://dev.nihl.wsib.ca';
    // console.log('process.env.PORT', process.env.PORT);
    // console.log('process.env.TESTD', process.env.TESTD);
    // console.log('data', data);
    // res.send(data);
    // const envData = {
    //   apiUrl: process.env.FRONTEND_URL,
    //   authorityUrlStart: process.env.AUTHORITY_START,
    //   authorityUrlContinue: process.env.AUTHORITY_CONTINUE,
    //   client_id: process.env.CLIENT_ID,
    //   redirect_uri: process.env.REDIRECT_URI,
    //   redirect_resume_uri: process.env.REDIRECT_RESUME_URI,
    //   post_logout_uri: process.env.POST_LOGOUT_URI,
    //   scope: process.env.SCOPE,
    //   timeOut: process.env.TIMEOUT
    // }
    const envData = {
      // apiUrl: process.env.FRONTEND_URL || 'http://localhost:4230',
      apiUrl: process.env.FRONTEND_URL || 'https://dev.nihl.wsib.ca',
      authorityUrlStart: process.env.AUTHORITY_START || 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_start_submission/v2.0',
      authorityUrlContinue: process.env.AUTHORITY_CONTINUE || 'https://wsibdev1.b2clogin.com/wsibdev1.onmicrosoft.com/B2C_1A_NIHL_continue_submission/v2.0',
      client_id: process.env.CLIENT_ID || '90caf621-66a6-43ca-a801-b7156b8149f2',
      redirect_uri: process.env.REDIRECT_URI || 'http://localhost:4230/auth-callback',
      redirect_resume_uri: process.env.REDIRECT_RESUME_URI || 'http://localhost:4230/auth-resume-callback',
      post_logout_uri: process.env.POST_LOGOUT_URI || 'http://localhost:4230/auth-logout',
      scope: process.env.SCOPE || 'openid offline_access https://wsibdev1.onmicrosoft.com/nihlapi/apiaccess',
      timeOut: process.env.TIMEOUT || 14
    }
    // console.log('envData', envData);
    res.send(envData);
  } catch (e) {
    console.log(e);
  }
});
const appUrls = {
  index: '/en/nihl',
  printPage: '/printerpage',
  indexFrench: '/fr/nihl',
  wizard: '/induced-hearing-loss-form',
  callback: '/auth-callback',
  resumeCallback: '/auth-resume-callback',
  authNewClaim: '/auth-newclaim',
  authResumeClaim: '/auth-resume',
  fr_url: '/fr'
}
app.get(appUrls.fr_url, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.resumeCallback, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.authNewClaim, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.authResumeClaim, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.callback, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.index, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.printPage, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.indexFrench, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.get(appUrls.wizard, function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/NIHLwebappA9/index.html'));
});
app.all("/nihl/*", function (req, res) {
  console.log(req.url);
  apiProxy.web(req, res, { target: apiUrl });
  console.log("Request made to /nihl/");
});
app.all("/scan", function (req, res) {
  apiProxy.web(req, res, { target: scanApiUrl });
  console.log("Request made to scanApiUrl");
});
app.post('/recaptcha', function (req, res) {
  console.log(req.query);
  //  return new Promise((resolve, reject) => {
  var options = {
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    qs: {
      secret: '6Le-oNIZAAAAAOgwfFZcHdNGZl2SztizZ5j3QEKb',
      response: req.query.token
    }
  };
  console.log(options);
  request(options, function (error, response, body) {
    res.send(body);
    // return body;
    // if (error) {
    //   reject(error)
    // }
    // console.log(body);
    // return resolve({
    //   data: body,
    //   "status": true
    // });
  });
});
//});
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Express server listening on port ' + PORT);
});