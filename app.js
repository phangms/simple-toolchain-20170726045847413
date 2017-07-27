require('newrelic');
/*eslint-env node*/
var http = require('http');
var url = require('url');
var fs = require('fs');
var xml = require('xml');



//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var request = require('superagent');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var broken = false;

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.get('/importantroute', (req, res) => {
  if (broken) {
    res.status(500).send('Error: app is currently broken');
  }
  res.status(200).send('App works fine!');
});

app.get('/chceck', (req, res) => {

var filename = 'check.xml';

  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/xml'});
      return res.end("404 Not Found");
    }  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.write(data);
    return res.end();
  });

});


app.get('/breakme', (req, res) => {
  broken = true;

  res.send('App broken, click <a href="/fixme">here</a> to fix it.');
  //
  // var anUrl = appEnv.getServiceURL("IBM Alert Notification-ug", {
  //   auth: ["name", "password"]
  // });
  //
  // request
  //   .post(anUrl)
  //   .send({
  //     "Identifier": "important-app-broken",
  //     "What": "'Important app' application is down",
  //     "Where": "http://myimportantapp.mybluemix.net/",
  //     "Severity": "Fatal",
  //     "Type": "Problem",
  //     "Source": "application",
  //     "ApplicationsOrServices": [
  //       "myimportantapp"
  //     ],
  //     "URLs": [
  //       {
  //         "Description": "Application dashboard",
  //         "URL": "https://new-console.ng.bluemix.net/apps/d2696d99-5c67-4426-b3f9-9e0a9618e386?paneId=overview&ace_config=%7B%22orgGuid%22%3A%22bedff917-3abc-45f0-b213-e9e70fa3b4fe%22%2C%22spaceGuid%22%3A%22ed994490-1b42-4da1-8e9c-30450e0f7f5b%22%2C%22redirect%22%3A%22https%3A%2F%2Fnew-console.ng.bluemix.net%2Fdashboard%2Fcompute%23cfApp%22%2C%22bluemixUIVersion%22%3A%22Atlas%22%7D"
  //       },
  //       {
  //         "Description": "Availability dashboard",
  //         "URL": "https://new-console.ng.bluemix.net/monitoring/index?dashboard=console.dashboard.page.appmonitoring1&nav=false&ace_config=%7B%22orgGuid%22%3A%22bedff917-3abc-45f0-b213-e9e70fa3b4fe%22%2C%22spaceGuid%22%3A%22ed994490-1b42-4da1-8e9c-30450e0f7f5b%22%2C%22region%22%3A%22us-south%22%2C%22appGuid%22%3A%22d2696d99-5c67-4426-b3f9-9e0a9618e386%22%2C%22bluemixUIVersion%22%3A%22Atlas%22%2C%22idealHeight%22%3A684%2C%22appName%22%3A%22myimportantapp%22%2C%22appRoutes%22%3A%22myimportantapp.mybluemix.net%22%7D&bluemixNav=true"
  //       }
  //     ]
  //   })
  //   .end(function(err, an_res) {
  //     res.send('App broken, click <a href="/fixme">here</a> to fix it.')
  //   });
});

app.get('/fixme', (req, res) => {
  broken = false;

  res.send('App fixed, click <a href="/breakme">here</a> to break it.')

  var anUrl = appEnv.getServiceURL("IBM Alert Notification-ug", {
    auth: ["name", "password"]
  });

  // request
  //   .post(anUrl)
  //   .send({
  //     "Identifier": "important-app-broken",
  //     "What": "'Important app' application is down",
  //     "Where": "http://myimportantapp.mybluemix.net/",
  //     "Severity": "Fatal",
  //     "Type": "Resolution",
  //     "Source": "application",
  //     "ApplicationsOrServices": [
  //       "myimportantapp"
  //     ],
  //     "URLs": [
  //       {
  //         "Description": "Application dashboard",
  //         "URL": "https://new-console.ng.bluemix.net/apps/d2696d99-5c67-4426-b3f9-9e0a9618e386?paneId=overview&ace_config=%7B%22orgGuid%22%3A%22bedff917-3abc-45f0-b213-e9e70fa3b4fe%22%2C%22spaceGuid%22%3A%22ed994490-1b42-4da1-8e9c-30450e0f7f5b%22%2C%22redirect%22%3A%22https%3A%2F%2Fnew-console.ng.bluemix.net%2Fdashboard%2Fcompute%23cfApp%22%2C%22bluemixUIVersion%22%3A%22Atlas%22%7D"
  //       },
  //       {
  //         "Description": "Availability dashboard",
  //         "URL": "https://new-console.ng.bluemix.net/monitoring/index?dashboard=console.dashboard.page.appmonitoring1&nav=false&ace_config=%7B%22orgGuid%22%3A%22bedff917-3abc-45f0-b213-e9e70fa3b4fe%22%2C%22spaceGuid%22%3A%22ed994490-1b42-4da1-8e9c-30450e0f7f5b%22%2C%22region%22%3A%22us-south%22%2C%22appGuid%22%3A%22d2696d99-5c67-4426-b3f9-9e0a9618e386%22%2C%22bluemixUIVersion%22%3A%22Atlas%22%2C%22idealHeight%22%3A684%2C%22appName%22%3A%22myimportantapp%22%2C%22appRoutes%22%3A%22myimportantapp.mybluemix.net%22%7D&bluemixNav=true"
  //       }
  //     ]
  //   })
  //   .end(function(err, an_res) {
  //     res.send('App fixed, click <a href="/breakme">here</a> to break it.')
  //   });
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
