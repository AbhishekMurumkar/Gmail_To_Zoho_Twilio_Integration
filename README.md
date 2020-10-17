# Gmail To Zoho Twilio Integration

Steps 

1. run ```node index``` or ```npm start```
2. If you are running for first time, the console do prompts you to authenticate via a link given in console
3. After authentication is new file is generated (in /gmailApp/ folder), but only for first time
4. Once authentication is successful, we are fetching mails from file ```/gmailApp/initialize.js``` and function ```readUnReadMailsFromGmail```
5. After collecting emails, we are creating ticket from method ```createTicket()``` present in ```/zoho-integration/createTicket.js```
6. After generating ticket, we are passing ticket's url to ```sendURL()``` method to send SMS to phone number
7. Thus ```sendURL``` is present in ```/twilio-integration/index``` file, where we first **_shorten our ticket's url with tiny url_** and send tiny url as message to a phone number
