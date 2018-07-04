const {google} = require('googleapis');
const express = require('express');
const path = require('path');
const fs = require('fs');

var alist=[];
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const keyfile = path.join(__dirname, 'client_secret_.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
// const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const scopes = ['https://www.googleapis.com/auth/drive'];
// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

// Generate the url that will be used for authorization
this.authorizeUrl = client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});
var url=this.authorizeUrl;
module.exports={client,url};
