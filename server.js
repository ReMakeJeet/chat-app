import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
var c=1;
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {

    console.log('received: %s', data);
    // lets broadcast the msg first and then add funtionaly for dm
  
      
     wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
  });
  });

});
 


/*
use this to get ip and then use  this to send msg to that ip only! so what we can do is we can loop and get the ip from clients.froeach and
then if ip found then send to that client only 
for optimization use a map to O(1) lookup of client for ip addreess ! yaaaaaa i did it, i made the chat app finally without ai or tutorial or book
justpure docs! though i see the examples in the docs for this works but its okay , if not given then i might be reading the ip method anyway would 
took me a lot time thouhg to get theerer as i have to ok anyway! great!

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;

  ws.on('error', console.error);
});
*/
