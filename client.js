import WebSocket from 'ws';
import readline from 'node:readline';





const ws = new WebSocket('ws://localhost:8080/'); // here i want to pass a id as a path variable see 8080/id/1 and for security i will send a password too 
// so const ws = new WebSocket('ws://localhost:8080/id/jeet_solanki/password/#@Jeet2006');  so somethig like this! 
// because connection made by client should be validated separatly every time by the server as if not then if by lick someone got the ws url he/she can make connection!

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
   
});


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

// now take input and send it to the server and let server broadcast it to all other!
// then send to individual client! how i will get the client id? like to send this guy? how i will identfy unique clients? 
// if i have 10 clients how i can know them individually that this is jeet this is meet etc? 


