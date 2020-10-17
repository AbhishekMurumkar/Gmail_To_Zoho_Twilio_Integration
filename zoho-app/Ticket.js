"use strict";
exports.__esModule = true;
var Ticket = /** @class */ (function () {
    function Ticket(subject, description) {
        this.subCategory = "Sub General";
        this.productId = "";
        this.contactId = "32789000000081027";
        this.subject = null;
        this.dueDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 48)).toISOString();
        this.departmentId = "32789000000010772";
        this.channel = "Email";
        this.description = null;
        this.language = "English";
        this.priority = "High";
        this.category = "general";
        this.email = "carol@zylker.com";
        this.status = "Open";
        this.subject = subject;
        this.description = description;
    }
    Ticket.prototype.getData = function () {
        return JSON.stringify(this);
    };
    return Ticket;
}());
exports["default"] = Ticket;
