const fs            = require("fs");
const path          = require("path");
const readline      = require("readline");
const { google }    = require("googleapis");
const createTickets = require("../zoho-app/createTicket").createTickets;
const SCOPES        = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH    = path.join(__dirname, "token.json");

// Load client secrets from a local file.
let init = () => {
  fs.readFile(path.join(__dirname, "credentials.json"), (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content),readUnReadMailsFromGmail);
  });
};

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
  
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
//3. getting messages from gmail
async function readUnReadMailsFromGmail(auth, callback) {
  const gmail = google.gmail({ version: "v1", auth });
  let msgs = [];
  try {
    let temp = await gmail.users.messages.list({
      "userId": "me",
      "maxResults": 1
    });
    temp = temp.data.messages;
    for (var i in temp) {
      let m = await gmail.users.messages.get({ userId: "me", id: temp[i].id });
      await msgs.push({
        id:m.data.id,
        body:m.data.snippet,
        subject:m.data.payload.headers.filter(e=>e.name==="Subject")[0].value
      });
    }
    await createTickets(msgs);
  } catch (err) {
    console.log(err);
  }
}

exports.init = init;
