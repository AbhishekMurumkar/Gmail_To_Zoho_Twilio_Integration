const path         = require("path");
const request      = require("request");
const sendURL      = require("../twilio-integration").sendURL;
const Ticket       = require("./Ticket").default;
const config       = require("../config");
let   access_token = null;

function initializeToken() {
  console.log("Connecting to Zoho Account");
  let token_options = {
    method : "POST",
    url    : config.refresh_url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      refresh_token: config.refresh_token,
      client_id    : config.client_id,
      client_secret: config.client_secret,
      scope        : config.scope,
      redirect_url : config.redirect_url,
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
    console.log("Connected to Zoho Account. Now creating a ticket");
    for (var i in data) {
      let ticket = new Ticket(data[i].subject,data[i].body);
    //   console.log(ticket.getData());
      let ticket_options = {
        method : "POST",
        url    : config.tickets_url,
        headers: {
          Authorization : "Zoho-oauthtoken " + access_token,
          "Content-Type": "application/json",
        },
        body: ticket.getData(),
      };
      request(ticket_options, (err, resp) => {
        if (err) throw err;
        else {
          console.log("Ticket Created Successfully.");
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
