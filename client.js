//import { WebSocket } from './ws';


// ok

var flag = 0;
var sessionid=0;

const ws = new WebSocket('ws://localhost:8080/'); 

    ws.addEventListener('error', console.error);

    ws.addEventListener('open', function open() {
    const jsondata = {
        "req":0,
        "msg" : "hey please assign the sid"
    }
      ws.send(JSON.stringify(jsondata)); // req:0 means assign id
    });

    ws.addEventListener('message', async (event) => {
    var data = await event.data;
    console.log(JSON.stringify(data));
    const obj = JSON.parse(data);
        if(flag==0){
            sessionid = obj.sid;
            flag=1;
            resp_para.innerHTML = `session id recieved: ${obj.sid} with msg: ${obj.msg}`;
        }else{
            resp_para.innerHTML = `Dara recieved: from: ${obj.sender_id} with msg: ${obj.msg}`;
        }
    });

function send_msg() {
    if(!sessionid){
        ack_para.innerHTML = `wait till server gives session id then chat`;
        
    }else{
        const msg = prompt("Enter msg ");
        const recieverid = prompt("enter reciver id ");
        const d = {
            "sender_id": sessionid,
            "reciever_id":recieverid, 
            "messages": msg
        }
        ws.send(JSON.stringify(d));
        ack_para.innerHTML = `Msg sent: ${msg} to ${recieverid}`;
    }
  }

    const button = document.querySelector("button");
    const ack_para = document.getElementById("ack");
    const resp_para = document.getElementById("response");
    button.addEventListener("click", send_msg);
    
    


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



