import {user} from './landing_page_handle.js';
console.log("finnally home page");
console.log(user);
// TODO: IMP*** Create websocket connection when user in the home page in website!! and in home page we use singlepage app with multiScrean
/*
    DOCS: PrivateMessage websocket 
*/
const wsPrivateMessage = new WebSocket(`ws://localhost:8080/privatemessage/clientid/${user.id}`); 
    
    wsPrivateMessage.addEventListener('error', console.error);

    wsPrivateMessage.addEventListener('open', function open() {
        //TODO: check the user property of giving all the messsages at once SO new property introduesd in User Class: NeedAllMessages, set true when login 
                // and set it false after sending all messaages from here.  so call the post fetch req from here and update that thing. till this happen 
                // show loading messages at website, DON'T LET user do anything till this gets done. SO IT'S SYNCHRONOUS
        console.log("ok sending first message to let server perform pre-socket work");
        const data = {
            "first_private" : 1
        }
        ws.send(JSON.stringify(data);
    });

    wsPrivateMessage.addEventListener('message', async (event) => {
        var data = await event.data;
        console.log(JSON.stringify(data));
        const obj = JSON.parse(data); //TODO: the data is now containing the PrivateMessage object, so to work correctly with that first create that Class.
        if('first_private_msg' in obj){
            response_of_private_msg.innerHTML = `(Private)FIRST Data recieved msg: ${obj.first_private_msg}`; 
        }
        else{
            response_of_private_msg.innerHTML = `(Private)Data recieved: from: ${obj.sender_id} with msg: ${obj.msg}`; 
        }
    });

function send_private_msg() {
    if(!user){
        // fetch userid or tell to login first! but this should not happen, it can only happen if user cleaned the browser data(cokkies).
        console.log("login first");
        window.document.location.href = "./index.html";
    }else{
        const msg = prompt("Enter msg ");
        const recieverid = prompt("enter reciver id ");
        const d = { //TODO: create the original message object instead of this.
            "sender_id": sessionid,
            "reciever_id":recieverid, 
            "messages": msg
        }
        wsPrivateMessage.send(JSON.stringify(d));
        ack_for_private_msg.innerHTML = `(Private)Msg sent: ${msg} to ${recieverid}`;
    }
  }
  
    const private_msg_btn = document.querySelector("private_msg_btn");
    const ack_for_private_msg = document.getElementById("ack_for_private_msg");
    const response_of_private_msg = document.getElementById("response_of_private_msg");
    private_msg_btn.addEventListener("click", send_private_msg);

/*
    DOCS: GroupMessage websocket 
*/
const wsGroupMessage = new WebSocket(`ws://localhost:8080/groupmessage/clientid/${id}`); 

    wsGroupMessage.addEventListener('error', console.error);

    wsGroupMessage.addEventListener('open', function open() {
        // yaa so we dont need a first msg! as long as we send id in url.
        console.log("ok sending first message Wait no needed here!!");
       
    });

    wsGroupMessage.addEventListener('message', async (event) => {
        var data = await event.data;
        console.log(JSON.stringify(data));
        const obj = JSON.parse(data); //TODO: the data is now containing the PrivateMessage object, so to work correctly with that first create that Class.
        response_of_group_msg.innerHTML = `(Group)Data recieved: from: ${obj.sender_id} with msg: ${obj.messages}`; 
    });

async function send_group_msg() {
    if(!user){
        // fetch userid or tell to login first! but this should not happen, it can only happen if user cleaned the browser data(cokkies).
         console.log("login first");
        window.document.location.href = "./index.html";
    }else{
        const msg = prompt("Enter msg ");
        const groupid = prompt("enter group id ");
        
        // TODO: Chceck that this group exists then check that user is in this group or don't! 
            // and get all all members of the group 
        const members = await get_members(groupid);// i should cache this!! or what? i think we have to design it properly!! IMP**.
        
        const d = { //TODO: create the original message object instead of this.
            "sender_id": sessionid,
            "groupid":groupid, 
            "members": members,
            "messages": msg
        }
        wsGroupMessage.send(JSON.stringify(d));
        ack_for_group_msg.innerHTML = `(Group)Msg sent: ${msg} to ${recieverid}`;
    }
  }
async function add_member() {
    if(!user){
        // fetch userid or tell to login first! but this should not happen, it can only happen if user cleaned the browser data(cokkies).
         console.log("login first");
        window.document.location.href = "./index.html";
    }
        const grpid = prompt("Enter grp id to add member on ");  // right now anyone can add members, then  later check the role.
        const memberid = prompt("enter member id "); // later use public identity like username!!(mobile no can too)
       
         const url = `http://localhost:8080/group/${grpid}/member/${memberid}`;
        try {
            const res = await fetch(url);
            if (res.status!=200) {
                throw new Error(`Response status: ${res.status}`);
            }
            
            const result = await res.json();
            console.log(result);
           
            response_of_add_members.innerHTML = `(Group) Member added! ${result}`;

      } catch (error) {
        console.error(error.message);
      }
        
        

    }
  
    const group_msg_btn = document.querySelector("group_msg_btn");
    const ack_for_group_msg = document.getElementById("ack_for_group_msg");
    const response_of_group_msg = document.getElementById("response_of_group_msg");
    group_msg_btn.addEventListener("click", send_group_msg);
    
    const add_member_btn = document.querySelector("add_member_btn");
    const response_of_add_members = document.getElementById("response_of_add_members");
    add_member_btn.addEventListener("click", add_member);
    
      
    
// now make funtion CreateGroup, call a post fetch req.

    
function get_members(grpid){
    if(!user){
     console.log("login first");
            window.document.location.href = "./index.html";
    }
 //fetch
         const url = `http://localhost:8080/group/${grpid}/user/${user.id}`;
        try {
            const res = await fetch(url);
            if (res.status!=200) {
                throw new Error(`Response status: ${res.status}`);
            }
            
            const result = await res.json();
            console.log(result);
           
            response_of_create_grp.innerHTML = `Members  Successfully fetched for grpid : ${grpid}`;
            return result;// contains arr of ids ??
      } catch (error) {
        console.error(error.message);
      }
}
    

function create_group() {
        const groupname = prompt("Enter groupname "); //TODO: Check that  if you are a memeber of the grp only then allow to send msgs.
        const lastname = prompt("Enter lastname ");
        const reqData = {
            "groupname":groupname,
            "lastname":lastname
            //TODO: Add all the neccesury data like discription, members to be added and can anyone add anyone or admin-only.
        }
        //fetch
         const url = `http://localhost:8080/group`;
        try {
            const res = await fetch(url,
                {
                    method:"POST",  
                    body: JSON.stringify(reqData);
                });
            if (res.status!=200) {
                throw new Error(`Response status: ${res.status}`);
            }
            
            const result = await res.json();
            console.log(result);
           
            response_of_create_grp.innerHTML = `Group Created Successfully group id: ${result.id}`;
      } catch (error) {
        console.error(error.message);
      }

}
    


const create_group_btn = document.querySelector("create_grp_btn");
const response_of_create_grp = document.getElementById("response_of_create_grp");


















/*
===CODE FOR CLI===
import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(function loop(){
    rl.question('send a message ', (msg) => {
        if(msg=='q'){
            rl.close();
        }else{
             ws.send(msg);
             loop()
        }
    });
})();

*/



// now take input and send it to the server and let server broadcast it to all other!
// then send to individual client! how i will get the client id? like to send this guy? how i will identfy unique clients? 
// if i have 10 clients how i can know them individually that this is jeet this is meet etc? 

// here i want to pass a id as a path variable see 8080/id/1 and for security i will send a password too 
// so const ws = new WebSocket('ws://localhost:8080/id/jeet_solanki/password/#@Jeet2006');  so somethig like this! 
// because connection made by client should be validated separatly every time by the server as if not then if by lick someone got the ws url he/she can make connection!



