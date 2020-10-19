const cron = require("node-cron");
const GO = require("./gmailApp/initialize");

cron.schedule('*/10 * * * *',()=>{
	console.log("Cron running after 10 minutes");
	GO.init();
});
GO.init();
console.log("started Cron which runs for every 10 minutes");