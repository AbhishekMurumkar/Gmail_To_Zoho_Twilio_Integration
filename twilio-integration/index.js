const TinyURL = require('tinyurl');
const path    = require("path");
const config  = require("../config");
const client = require("twilio")(
  config.twilioAccountSID,
  config.twilioAuthToken
);

let sendURLToMobile = (url) => {
  console.log("Generating Short Url");
  if (url == undefined || url == null || url == "") {
    throw new Error("Not a valid URL to shorten");
  }
  TinyURL.shorten(url,(newurl,err)=>{
    if (err) throw err;
    client.messages
      .create({
        body: " - " + newurl,
        from: "+13177942287",
        to  : "+919000569815",
      })
      .then((message) => {
        console.log(`url is sent to contact ${message.to}`);
      })
      .catch((err) => console.log(err));
  });
};

// sendURLToMobile("https://desk.zoho.in/support/testingdecisionengines/ShowHomePage.do#Cases/dv/32789000000087207");

exports.sendURL = sendURLToMobile;
