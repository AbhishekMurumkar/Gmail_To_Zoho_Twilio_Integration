const path         = require("path");
const request      = require("request");
const sendURL      = require("../twilio-integration").sendURL;
const Ticket       = require("./Ticket").default;
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

let   access_token = null;

function initializeToken() {
  let token_options = {
    method : "POST",
    url    : process.env.refresh_url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      refresh_token: process.env.refresh_token,
      client_id    : process.env.client_id,
      client_secret: process.env.client_secret,
      scope        : process.env.scope,
      redirect_url : process.env.redirect_url,
      grant_type   : "refresh_token",
    },
  };
  return new Promise((resolve, reject) => {
    request(token_options, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body).access_token);
      }
    });
  });
}

async function createTicket(data) {
  try {
    access_token = await initializeToken();
    for (var i in data) {
      let ticket = new Ticket(data[i].subject,data[i].body);
    //   console.log(ticket.getData());
      let ticket_options = {
        method : "POST",
        url    : process.env.tickets_url,
        headers: {
          Authorization : "Zoho-oauthtoken " + access_token,
          "Content-Type": "application/json",
        },
        body: ticket.getData(),
      };
      request(ticket_options, (err, resp) => {
        if (err) throw err;
        else {
          let temp      = JSON.parse(resp.body);
          let ticketURL = temp.webUrl;
        //   console.log(temp);
          sendURL(ticketURL);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.createTickets = createTicket;

// createTicket();
