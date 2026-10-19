import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });


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
ws.send(data);
const mobile_number_and_client = new Map();

const mobile_no = get_mobile_no_from_url(url);

function get_mobile_no_from_url(url){
// extract mobile no passed in by client!
return mobile_no;
}
mobile_number_and_client.set(mobile_no,ws);

use this to get ip and then use  this to send msg to that ip only! so what we can do is we can loop and get the ip from clients.froeach and
then if ip found then send to that client only 
for optimization use a map to O(1) lookup of client for ip addreess ! yaaaaaa i did it, i made the chat app finally without ai or tutorial or book
justpure docs! though i see the examples in the docs for this works but its okay , if not given then i might be reading the ip method anyway would 
took me a lot time thouhg to get theerer as i have to ok anyway! great!


i might will need proccess id of client! not the ip adddress
so port address of clients how can i get that?? 
can i assign a id to the connected socket??
hmm for this i might will have to see what the client object is containing in server as in the foreach loop!
so       _connectionKey: '6::::8080', might be a potential identifier !

so i can use port number     _peername: { address: '::1', family: 'IPv6', port: 52418 },
 
 map port number with user id! 
 but port id can change! as connection lost once??? let's verify!
    

yaaa port address change everytime so i cant identify based on that

now i got another idea! 
which is at server side i will send client id from client itself! and the fact is that client will get client id from a rest API call!
and then send that ip address when trying to make connection ! 

actually i have to validate the client before it get's connected to me at all!
so i will do that?
    -- can i send a msg with the connecton request? 
        ++ if not so then i can first let it connect and then wait for a flag to be true 
            the flag is marked true if the socket connected with port address x is verified with the id and password 
                so id and password were sent as a first msg and response would be to let the client know that we dont need this anymore! you are verifed!
        ++ every new port have to verify it first else no msg will be forwarded!! 
        -- this is not a good design at all! 
        verification at the connection time is correct but for that ws should provide a way to inject id password from the client or a hash frpm the client
        to the server via ws! 
        ++ another safe way would be to like pre port verification!
        -- means before the connection is established i will send A RESTapi call and stat that a client with ip addrs x and port add y will connect sooooooonnnn
             so we can assign it a expiry time and store this promise in a arrray in the server side 
             and when a connectoin is requested then check the ip and port and the expriy time if all the conditions were met then let the connection happend
             and store this port and ip with the user name earlier given by the rest api call!
        so there are many hacks and also workable !
        but the most convieninet one was to send a msg or payload with a hash at the connection time itself
        so that no malfuntioning at all allowed
        
        so task 1. get to know about websocket! websocketserver see how client can send msg having a hash or id and server can see it verify it and so on!
        
        
        
        SO ANYWAY I AM GOING WITH FIRST CONNECTION AND THEN USE ws.send() to verify and if not verifed and sending msgs then server would not forward them!
        the thing is no body will know our internal api end point so no hacking!
        also later on i will make ws url's on the fly 
        and i am ALSO NOT DEPENDING ON EXISTING FUNTIONS TO HELP ME OUT TO GET THE TOKEN FROM THE URL 
        AND I KNOW I  CAN SEE THE EXACT URL USED BY THE CLIENT AS: ws.url so everything is clear
        i know I CAN USE UPGRDAE CONNECTION BUT ITS NOT SUPPTOETED IN HTTP 2 NAD 3 SO NOT GOING WITH THAT YET! THATS EASY THOUGH! 
        
*/


// actually i d/ont need port address what i can do is
// just use id in url and store clients in a map with id!
// and whenever one client x wants to send msg to y then x gives y's id!
// how x knows y's id? because x is y's friend? or x knows y's public id??
// like mobile number? yaa! mobile no is public id!

// now the q is how i will get the url or what ever passed by client?
// if ws.send() creates an event message that server listens then 
// cana i make another method that generates an event from client?
// like so ws.on('connection/id') and then hte q is how i will extract the id?
