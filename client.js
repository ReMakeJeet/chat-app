const user = JSON.parse(localStorage.getItem("user"));
console.log("finnally home page");
console.log(user);
// TODO: IMP*** Create websocket connection when user in the home page in website!! and in home page we use singlepage app with multiScrean
/*
    DOCS: PrivateMessage websocket 
*/
const wsPrivateMessage = new WebSocket("ws://localhost:8080/privatemessage"); 
    
    wsPrivateMessage.addEventListener('error', console.error);

    wsPrivateMessage.addEventListener('open', function open() {
        //TODO: check the user property of giving all the messsages at once SO new property introduesd in User Class: NeedAllMessages, set true when login 
                // and set it false after sending all messaages from here.  so call the post fetch req from here and update that thing. till this happen 
                // show loading messages at website, DON'T LET user do anything till this gets done. SO IT'S SYNCHRONOUS
        console.log("ok sending first message to let server perform pre-socket work");
        const data = {
            "first_private" : 1,
            "username" : user.username // get id at server side!!
        }
        wsPrivateMessage.send(JSON.stringify(data));
    });

    wsPrivateMessage.addEventListener('message', async (event) => {
        var data = await event.data;
        console.log(JSON.stringify(data));
        const obj = JSON.parse(data); //TODO: the data is now containing the PrivateMessage object, so to work correctly with that first create that Class.
        if('first_private_msg' in obj){
            response_of_private_msg.innerHTML = `(Private)FIRST Data recieved msg: ${obj.first_private_msg}`; 
        }
        else{
            response_of_private_msg.innerHTML = `(Private)Data recieved: from: ${obj.sender_username} with msg: ${obj.msg}`; 
        }
    });

function send_private_msg() {
    if(!user){
        // fetch userid or tell to login first! but this should not happen, it can only happen if user cleaned the browser data(cokkies).
        console.log("login first");
        window.document.location.href = "./index.html";
    }else{
        const msg = prompt("Enter msg ");
        const reciever_username = prompt("enter reciver username ");
        const d = { //TODO: create the original message object instead of this.
            "sender_username": user.username,
            "reciever_username":reciever_username, 
            "messages": msg
        }
        wsPrivateMessage.send(JSON.stringify(d));
        ack_for_private_msg.innerHTML = `(Private)Msg sent: ${msg} to ${reciever_username}`;
    }
  }
  
    const private_msg_btn = document.getElementById("private_msg_btn");
    const ack_for_private_msg = document.getElementById("ack_for_private_msg");
    const response_of_private_msg = document.getElementById("response_of_private_msg");
    private_msg_btn.addEventListener("click", send_private_msg);

/*
    DOCS: GroupMessage websocket 
*/
const wsGroupMessage = new WebSocket("ws://localhost:8080/groupmessage"); 

    wsGroupMessage.addEventListener('error', console.error);

    wsGroupMessage.addEventListener('open', function open() {
        // yaa so we dont need a first msg! as long as we send id in url.
        console.log("ok sending first message Wait no needed here!!");
        // well it needs!
          const data = {
            "first_group" : 1,
            "username" : user.username
        }
        wsGroupMessage.send(JSON.stringify(data));
       
    });

    wsGroupMessage.addEventListener('message', async (event) => {
        var data = await event.data;
        console.log(JSON.stringify(data));
        const obj = JSON.parse(data); //TODO: the data is now containing the PrivateMessage object, so to work correctly with that first create that Class.
        if('first_group_msg' in obj){
            response_of_group_msg.innerHTML = `(Group)FIRST Data recieved msg: ${obj.first_group_msg}`; 
        }else{
        response_of_group_msg.innerHTML = `(Group)Data recieved: from: ${obj.username} with msg: ${obj.messages}`; 
        }
    });

async function send_group_msg() {
    if(!user){
        // fetch userid or tell to login first! but this should not happen, it can only happen if user cleaned the browser data(cokkies).
         console.log("login first");
        window.document.location.href = "./index.html";
    }else{
        const msg = prompt("Enter msg ");
        const groupid = prompt("enter group id ");//TODO:IMP** use grp_username here also instead of group id, later on!!
        
        // TODO: Chceck that this group exists then check that user is in this group or don't! 
            // and get all all members of the group 
        const members = await get_members(groupid);// i should cache this!! or what? i think we have to design it properly!! IMP**.
        
        const d = { //TODO: create the original message object instead of this.
            "sender_username": user.username,
            "groupid":groupid, 
            "members": members,
            "messages": msg
        }
        wsGroupMessage.send(JSON.stringify(d));
        ack_for_group_msg.innerHTML = `(Group)Msg sent: ${msg} to ${groupid}`;
    }
  }
async function add_member() {
    if(!user){
        // fetch userid or tell to login first! but this should not happen, it can only happen if user cleaned the browser data(cokkies).
         console.log("login first");
        window.document.location.href = "./index.html";
    }
        const grpid = prompt("Enter grp id to add member on ");  // right now anyone can add members, then  later check the role.
        const member_username = prompt("enter member username "); // later use public identity like username!!(mobile no can too)
       
         const url = `http://localhost:8080/group/${grpid}/member/${member_username}`;
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
  
    const group_msg_btn = document.getElementById("group_msg_btn");
    const ack_for_group_msg = document.getElementById("ack_for_group_msg");
    const response_of_group_msg = document.getElementById("response_of_group_msg");
    group_msg_btn.addEventListener("click", send_group_msg);
    
    const add_member_btn = document.getElementById("add_member_btn");
    const response_of_add_members = document.getElementById("response_of_add_members");
    add_member_btn.addEventListener("click", add_member);
    
      
    
// now make funtion CreateGroup, call a post fetch req.

    
async function get_members(grpid){
    if(!user){
     console.log("login first");
            window.document.location.href = "./index.html";
    }
 //fetch
         const url = `http://localhost:8080/group/${grpid}/user/${user.username}`;
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
    

async function create_group() {
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
                    body: JSON.stringify(reqData),
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
    


const create_group_btn = document.getElementById("create_grp_btn");
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



