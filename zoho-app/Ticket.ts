export default class Ticket{
    subCategory="Sub General";
    productId="";
    contactId="32789000000081027";
    subject=null;
    dueDate=new Date(new Date().getTime()+(1000*60*60*48)).toISOString();
    departmentId="32789000000010772";
    channel="Email";
    description=null;
    language="English";
    priority="High";
    category="general";
    email="carol@zylker.com";
    status="Open";
    constructor(subject,description){
        this.subject=subject;
        this.description=description;
    }
    getData(){
        return JSON.stringify(this);
    }
}